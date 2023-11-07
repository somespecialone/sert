// https://github.com/nuxt/nuxt/issues/14598#issuecomment-1397361152
export default eventHandler((event) => {
  const config = useRuntimeConfig(event)

  event.headers.get('Origin') && setResponseHeaders(event, { 'Access-Control-Allow-Origin': config.allowOrigin })

  if (event.method === 'OPTIONS') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*'
    })
    sendNoContent(event)
  }
})
