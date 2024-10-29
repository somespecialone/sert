export type Options = {
  listingId: string
  itemMarketName: string
  listingFilterParam: string
  listingStartParam: string
  currencies: string
  rateLimit: number
  steamGameId: string
  historySize: number
}
export type RatesEntry = { [key in keyof typeof CURRENCIES]?: { updated: number; rate: number } }
export type HistoryEntry = { [key in keyof typeof CURRENCIES]?: { updated: number; history: [number, number][] } }

export async function updateRatesHistory(
  histories: HistoryEntry,
  {
    listingId,
    itemMarketName,
    listingFilterParam,
    listingStartParam,
    currencies: currenciesRaw,
    rateLimit,
    steamGameId,
    historySize
  }: Options
) {
  const listingURL = `https://steamcommunity.com/market/listings/${steamGameId}/${encodeURIComponent(itemMarketName)}`

  const currencies = currenciesRaw.split(',').reduce<[number, keyof typeof CURRENCIES][]>((targetArr, curName) => {
    const trimmed = curName.trim() as keyof typeof CURRENCIES
    trimmed in CURRENCIES && targetArr.push([CURRENCIES[trimmed], trimmed])
    return targetArr
  }, [])

  let originalToUSDRate = 1 // original currency rate to USD

  const toOmit = Object.entries(histories).reduce((resArr, [currencyName, { updated }]) => {
    if (!rateIsExpired(updated)) {
      resArr.push(currencyName) // omit
    }
    return resArr
  }, [])

  // if all updated in time there is no need to fetch something
  if (currencies.every(([, currName]) => toOmit.includes(currName))) return

  let i = 0
  for (const [currencyId, currencyName] of [[1, 'USD'], ...currencies] as [number, 'USD' | keyof typeof CURRENCIES][]) {
    if (toOmit.includes(currencyName)) continue
    if (i === rateLimit) break

    const query = new URLSearchParams({
      start: listingStartParam,
      count: '10',
      country: 'UA',
      language: 'english',
      currency: currencyId.toString(),
      filter: listingFilterParam
    })

    const resp = await fetch(listingURL + '/render/?' + query, {
      method: 'GET',
      headers: { referer: listingURL }
    })
    i++

    if (resp.ok) {
      const resJson: Record<string, Record<string, Record<string, number>>> = await resp.json()
      const listingData = resJson['listinginfo'][listingId]
      if (!listingData || !Object.entries(listingData).length) {
        console.error(`Can't find listing info for ${currencyName}!`)
        continue
      }

      // UTC ts in seconds
      const updated = Math.round(getUTCDate().getTime() / 1000)

      if (currencyId === 1) {
        originalToUSDRate = myRound(listingData['price'] / listingData['converted_price'])

        // original listing currency if she in to fetch list and not omitted due to update time
        const originalCurrencyValues = currencies.find(([currId]) => currId === listingData['currencyid'] - 2000)
        if (originalCurrencyValues?.length && !toOmit.includes(originalCurrencyValues[1])) {
          const originalCurrencyName = originalCurrencyValues[1]
          const originalHistory =
            originalCurrencyName in histories ? chunkArray(histories[originalCurrencyName].history, historySize)[0] : []
          originalHistory.unshift([originalToUSDRate, updated])

          histories[originalCurrencyName] = { updated, history: originalHistory }

          toOmit.push(originalCurrencyName)
        }
      } else {
        const rate = myRound((listingData['converted_price'] / listingData['price']) * originalToUSDRate)
        const history = currencyName in histories ? chunkArray(histories[currencyName].history, historySize)[0] : []

        // check if steam give me corrupt converted price.
        // It is highly unlikely that rate drop more than 10x times in one day
        if (((history[0] || [])[0] || rate) / rate > 10) {
          console.warn(`Received inconsistent data. ${currencyName}: ${history[0][0]} -> ${rate}`)
          continue
        }

        history.unshift([rate, updated])

        histories[currencyName] = { updated, history }
      }
    } else if (resp.status === 429) {
      console.warn(`Hit rate limit with ${i}s attempt!`)
      break
    } else {
      console.error(`Get error response with ${resp.status} status and "${resp.statusText}" message!`)
    }
  }
}
