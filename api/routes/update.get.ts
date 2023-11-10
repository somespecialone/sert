// manual update trigger
import actionEventHandler from './__space/v0/actions.post'

export default defineEventHandler(async (event) => {
  event._requestBody = JSON.stringify({ event: { id: 'update-rates' } })
  event._method = 'POST'
  return await actionEventHandler(event)
})
