export default defineNitroPlugin(({ hooks }) => {
  hooks.hook('cloudflare:scheduled', ({ context }) => {
    context.waitUntil(async () => {
      const config = useRuntimeConfig()
      const storage = useStorage('cloudflareKV')

      if (!config.listingId) {
        console.warn('LISTING_ID env. variable not passed, skip updating rates')
        return
      }

      let histories = await storage.getItem<HistoryEntry>('history', { type: 'json' })
      histories = histories || {}

      await updateRatesHistory(histories, config)

      // sort histories
      histories = Object.entries(histories)
        .sort((a, b) => CURRENCIES[a[0]] - CURRENCIES[b[0]])
        .reduce((resObj, [currencyName, { updated, history }]) => {
          resObj[currencyName] = { updated, history }
          return resObj
        }, {})

      const rates: RatesEntry = Object.entries(histories).reduce((resObj, [currencyName, { updated, history }]) => {
        resObj[currencyName] = { updated, rate: history[0][0] }
        return resObj
      }, {})

      await storage.setItem('history', JSON.stringify(histories))
      await storage.setItem('rates', JSON.stringify(rates))
    })
  })
})
