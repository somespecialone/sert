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
        .sort(([curr1], [curr2]) => CURRENCIES[curr1] - CURRENCIES[curr2])
        .reduce((resObj, [currencyName, history]) => {
          resObj[currencyName] = history
          return resObj
        }, {})

      const rates: RatesEntry = Object.entries(histories).reduce((resObj, [currencyName, history]) => {
        resObj[currencyName] = history[0]
        return resObj
      }, {})

      await storage.setItem('history', JSON.stringify(histories))
      await storage.setItem('rates', JSON.stringify(rates))
    })
  })
})
