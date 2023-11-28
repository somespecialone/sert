import type { H3Event } from 'h3'

type DbEntry = { key: string; history?: [number, number][]; updated: number; rate?: number }

export async function updateCurrencyRates(event: H3Event): Promise<DbEntry[]> {
  const config = useRuntimeConfig(event)
  const { base } = event.context.deta

  const {
    listingId,
    itemMarketName,
    listingFilterParam,
    listingStartParam,
    currenciesToFetch: currenciesRaw,
    rateLimit,
    steamGameId,
    historySize
    // @ts-ignore
  } = config as { rateLimit: number; historySize: number; [key: string]: string }

  const listingURL = `https://steamcommunity.com/market/listings/${steamGameId}/${encodeURIComponent(itemMarketName)}`

  const currenciesToFetch = currenciesRaw
    .split(',')
    .reduce<[number, keyof typeof CURRENCIES][]>((targetArr, curName) => {
      const trimmed = curName.trim() as keyof typeof CURRENCIES
      trimmed in CURRENCIES && targetArr.push([CURRENCIES[trimmed], trimmed])
      return targetArr
    }, [])

  const items: DbEntry[] = []
  let originalToUSDRate = 1 // original currency rate to USD

  const querySet = await base.fetch()
  const querySetItems = querySet.items as DbEntry[]

  // all histories, even not omitted
  const histories = querySetItems.reduce<{ [key: string]: [number, number][] }>((resObj, { key, history }) => {
    history && (resObj[key] = history)
    return resObj
  }, {})

  // @ts-ignore
  const toOmit: [keyof typeof CURRENCIES] = querySetItems.reduce((resArr, { key, updated }) => {
    if (key.startsWith(RATES_PREFIX)) {
      if (!rateIsExpired(updated)) {
        resArr.push(key.split(RATES_PREFIX)[1] as never) // omit
      }
    }
    return resArr
  }, [])

  // if all updated in time there is no need to fetch something
  if (currenciesToFetch.every(([, currName]) => toOmit.includes(currName))) return items

  let i = 0
  for (const [currencyId, currencyName] of [[1, 'USD'], ...currenciesToFetch] as [number, keyof typeof CURRENCIES][]) {
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
        const originalCurrency = currenciesToFetch.find(([currId]) => currId === listingData['currencyid'] - 2000)
        if (originalCurrency?.length && !toOmit.includes(originalCurrency[1])) {
          const ratesKey = RATES_PREFIX + originalCurrency[1]
          const historyKey = HISTORY_PREFIX + originalCurrency[1]
          const originalHistory = historyKey in histories ? chunkArray(histories[historyKey], historySize)[0] : []
          originalHistory.unshift([originalToUSDRate, updated])

          items.push({ key: ratesKey, updated, rate: originalToUSDRate })
          items.push({ key: historyKey, updated, history: originalHistory })

          toOmit.push(originalCurrency[1])
        }
      } else {
        const ratesKey = RATES_PREFIX + currencyName
        const historyKey = HISTORY_PREFIX + currencyName
        const rate = myRound((listingData['converted_price'] / listingData['price']) * originalToUSDRate)
        const history = historyKey in histories ? chunkArray(histories[historyKey], historySize)[0] : []

        // check if steam give me corrupt converted price.
        // It is highly unlikely that rate drop more than 10x times in one day
        if (history[0][0] / rate > 10) {
          console.warn(`Received inconsistent data. ${currencyName}: ${history[0][0]} -> ${rate}`)
          continue
        }

        history.unshift([rate, updated])

        items.push({ key: ratesKey, updated, rate })
        items.push({ key: historyKey, updated, history })
      }
    } else if (resp.status === 429) {
      console.warn(`Hit rate limit [i=${i}].`)
      break
    }
  }

  // save chunks
  if (items.length) {
    for (const chunk of chunkArray(items, 25)) {
      await base.putMany(chunk)
    }
  }

  return items
}
