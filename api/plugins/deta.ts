import { Deta } from 'deta'

export default defineNitroPlugin(({ hooks }) => {
  const config = useRuntimeConfig()
  const deta = Deta(config.detaProjectKey)
  const base = deta.Base(config.detaBaseName)

  hooks.hook('request', (e) => {
    e.context.deta = { base }
  })
})
