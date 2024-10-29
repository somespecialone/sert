export default defineEventHandler(async () => {
  const storage = useStorage('cloudflareKV')

  const rates = await storage.getItem<RatesEntry>('rates', { type: 'json' })
  return rates || {}
})
