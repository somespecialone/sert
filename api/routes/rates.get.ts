type RateItem = { key: string; updated: number; rate: number }

export default defineEventHandler(async (event) => {
  const { base } = event.context.deta

  const { items } = await base.fetch({ 'key?pfx': RATES_PREFIX })

  return (items as RateItem[])
    .sort(
      (a, b) =>
        CURRENCIES[a.key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES] -
        CURRENCIES[b.key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES]
    )
    .reduce<{ [key in keyof typeof CURRENCIES]?: [number, number] }>((resObj, { key, rate, updated }) => {
      resObj[key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES] = [rate, updated]
      return resObj
    }, {})
})
