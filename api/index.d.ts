import Base from 'deta/dist/types/base/base'

declare module 'h3' {
  interface H3EventContext {
    deta: { base: Base }
  }
}
