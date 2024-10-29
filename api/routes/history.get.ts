export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const storage = useStorage('cloudflareKV')

  const { length = config.historyLength, all } = getQuery<{ length?: string; all?: string }>(event)

  if (Array.isArray(length) || Number(length) <= 0) {
    throw createError({ statusMessage: 'Invalid "length" query param', statusCode: 400 })
  }

  const histories = await storage.getItem<HistoryEntry>('history', { type: 'json' })

  if (!histories) return {}

  // trunk history if needed
  Object.entries(histories).forEach(([currencyName, { history }]) => {
    histories[currencyName].history = history.slice(0, all || all === '' ? undefined : Number(length))
  })

  return histories
})
