// https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    detaProjectKey: '',
    detaBaseName: 'SERT',
    allowOrigin: '*',
    listingId: '',
    itemMarketName: '',
    listingFilterParam: '',
    listingStartParam: '0',
    currenciesToFetch: 'EUR,PLN,UAH',
    rateLimit: 4,
    steamGameId: '730',
    historySize: 150,
    historyLength: 30
  },
  imports: { dirs: ['constants', 'cron'] },
  noPublicDir: true
})
