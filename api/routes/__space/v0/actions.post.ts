// CRON job route for Deta

export default defineEventHandler(async (event) => {
  const { event: detaEvent } = await readBody<{ event?: { id: string } }>(event)
  if (detaEvent?.id === 'update-rates') {
    return await updateCurrencyRates(event)
  } else {
    throw createError({ statusCode: 400 })
  }
})
