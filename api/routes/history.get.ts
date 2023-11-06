type HistoryItem = { key: string; updated: number; history: [number, number][] }

export default defineEventHandler(async (event) => {
  const { base } = event.context.deta
  const config = useRuntimeConfig(event)

  const { length = config.historyLength, all } = getQuery<{ length?: string; all?: string }>(event)

  if (Array.isArray(length) || length <= 0) {
    throw createError({ statusMessage: 'Invalid "length" query param', statusCode: 400 })
  }

  const { items } = await base.fetch({ 'key?pfx': HISTORY_PREFIX })
  return (items as HistoryItem[])
    .sort(
      (a, b) =>
        CURRENCIES[a.key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES] -
        CURRENCIES[b.key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES]
    )
    .reduce(
      (resObj, { key, history }) => {
        resObj[key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES] = history.slice(
          0,
          all || all === '' ? undefined : length
        )
        return resObj
      },
      {} as Record<keyof typeof CURRENCIES, number[][]>
    )
})
