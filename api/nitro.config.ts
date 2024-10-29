// https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    allowOrigin: '*',
    listingId: '',
    itemMarketName: '',
    listingFilterParam: '',
    listingStartParam: '0',
    currencies: 'EUR,PLN,UAH',
    rateLimit: 4,
    steamGameId: '730',
    historySize: 150,
    historyLength: 30
  },
  imports: { dirs: ['constants', 'cron', 'lib'] },
  noPublicDir: true,
  preset: 'cloudflare-worker',
  compatibilityDate: '2024-10-27',
  storage: {
    cloudflareKV: {
      driver: 'cloudflareKVBinding',
      binding: 'sert-kv'
    }
  }
})
