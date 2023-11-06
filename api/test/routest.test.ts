import { promisify } from 'util'
import { exec } from 'child_process'
import { createServer } from 'http'

import { loadEnv } from 'vite'
import { test, beforeAll, expect, vi, describe, afterAll } from 'vitest'
import { SuperAgentTest, agent as _agent } from 'supertest'
import { Deta } from 'deta'

import { RATES_PREFIX, HISTORY_PREFIX } from '../constants'

const execAsync = promisify(exec)

let agent: SuperAgentTest

beforeAll(async () => {
  Object.assign(process.env, loadEnv('', './', '')) // load .env from local testing

  vi.stubEnv('NITRO_DETA_BASE_NAME', 'test')
  vi.stubEnv('NITRO_PRESET', 'node')

  await execAsync('pnpm build')
  // @ts-ignore
  const { handler } = await import('../.output/server/index.mjs')
  agent = _agent(createServer(handler))

  const deta = Deta()
  const base = deta.Base(process.env.NITRO_DETA_BASE_NAME)

  const updated = MOCK_CURRENCY_HISTORY[0][1]
  await base.put({ rate: MOCK_CURRENCY_HISTORY[0][0], updated }, RATES_PREFIX + MOCK_CURRENCY)
  await base.put({ history: MOCK_CURRENCY_HISTORY, updated }, HISTORY_PREFIX + MOCK_CURRENCY)
})

afterAll(async () => {
  const deta = Deta()
  const base = deta.Base(process.env.NITRO_DETA_BASE_NAME)

  await base.delete(RATES_PREFIX + MOCK_CURRENCY)
  await base.delete(HISTORY_PREFIX + MOCK_CURRENCY)
})

describe('Test routes', () => {
  test('Rates route', async () => {
    const res = await agent.get('/rates').expect(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body[MOCK_CURRENCY]).toEqual(MOCK_CURRENCY_HISTORY[0])
  })
  test('History route', async () => {
    const res = await agent.get('/history').expect(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body[MOCK_CURRENCY]).toEqual(MOCK_CURRENCY_HISTORY.slice(0, Number(process.env.HISTORY_LENGTH || 30)))
  })
  test('History route with length', async () => {
    const res = await agent.get('/history?length=15').expect(200)
    expect(res.body[MOCK_CURRENCY]).toEqual(MOCK_CURRENCY_HISTORY.slice(0, 15))
  })
  test('History route all', async () => {
    const res = await agent.get('/history?all').expect(200)
    expect(res.body[MOCK_CURRENCY]).toEqual(MOCK_CURRENCY_HISTORY)
  })
})

// data
const MOCK_CURRENCY = 'CARB'
const MOCK_CURRENCY_HISTORY = [
  [36.94, 1682986141],
  [36.77, 1682899741],
  [36.77, 1682813341],
  [36.77, 1682726941],
  [36.71, 1682640541],
  [36.86, 1682554141],
  [36.74, 1682467741],
  [36.85, 1682381341],
  [36.77, 1682294941],
  [36.77, 1682208541],
  [36.77, 1682122141],
  [36.85, 1682035741],
  [36.75, 1681949341],
  [36.75, 1681862941],
  [36.95, 1681776541],
  [36.97, 1681690141],
  [36.97, 1681603741],
  [36.97, 1681517341],
  [36.79, 1681430941],
  [36.68, 1681344541],
  [36.9, 1681258141],
  [36.69, 1681171741],
  [36.71, 1681085341],
  [36.71, 1680998941],
  [36.71, 1680912541],
  [36.91, 1680826141],
  [36.92, 1680739741],
  [36.84, 1680653341],
  [36.7, 1680567003],
  [36.74, 1680480541],
  [36.74, 1680394141],
  [36.74, 1680307741],
  [36.73, 1680221341],
  [36.74, 1680134941],
  [36.76, 1680048541],
  [36.76, 1679962141],
  [36.78, 1679875741],
  [36.78, 1679789341],
  [36.78, 1679702941],
  [36.77, 1679616541],
  [36.96, 1679530141],
  [36.96, 1679443741],
  [36.89, 1679357341],
  [36.8, 1679274541],
  [36.8, 1679184541],
  [36.8, 1679098141],
  [36.92, 1679011741],
  [36.72, 1678925341],
  [36.88, 1678838941],
  [36.92, 1678752541],
  [36.92, 1678666141],
  [36.92, 1678579741],
  [36.92, 1678529341],
  [36.94, 1678320541],
  [36.95, 1678234141],
  [36.96, 1678147741],
  [36.95, 1678061341],
  [36.95, 1677974940],
  [36.95, 1677888541],
  [36.94, 1677802141],
  [36.95, 1677715797],
  [36.95, 1677629341],
  [36.95, 1677542941],
  [36.94, 1677456541],
  [36.94, 1677370141],
  [36.94, 1677283741],
  [36.95, 1677197341],
  [36.96, 1677110941],
  [36.96, 1677024541],
  [36.96, 1676938141],
  [36.96, 1676851741],
  [36.96, 1676765341],
  [36.96, 1676678941],
  [36.94, 1676592541],
  [36.97, 1676506141],
  [36.95, 1676419789],
  [36.95, 1676333389],
  [36.95, 1676246989],
  [36.95, 1676160589],
  [36.95, 1676074189],
  [36.94, 1675987789],
  [36.95, 1675901389],
  [36.94, 1675814989],
  [36.96, 1675728589],
  [36.95, 1675642189],
  [36.95, 1675555788],
  [36.95, 1675469389],
  [36.95, 1675382989],
  [36.95, 1675296589],
  [36.94, 1675210189],
  [36.96, 1675123789],
  [36.94, 1675037389],
  [36.94, 1674950989],
  [36.94, 1674864589],
  [36.97, 1674778189],
  [36.97, 1674691789],
  [36.97, 1674605389],
  [36.97, 1674518988],
  [36.94, 1674432589],
  [36.94, 1674346189],
  [36.94, 1674259789],
  [36.95, 1674173389],
  [36.95, 1674086989],
  [36.97, 1674000589],
  [36.95, 1673914189],
  [36.95, 1673827788],
  [36.95, 1673741389],
  [36.95, 1673654989],
  [36.97, 1673568588],
  [36.96, 1673482189],
  [36.96, 1673395789],
  [36.97, 1673309389],
  [36.95, 1673222989],
  [36.95, 1673136589],
  [36.95, 1673050189],
  [36.97, 1672963789],
  [36.95, 1672877389],
  [36.96, 1672790989],
  [36.96, 1672704588],
  [36.96, 1672618189],
  [36.96, 1672531789],
  [36.96, 1672445389],
  [36.96, 1672358989],
  [36.96, 1672272589],
  [36.95, 1672186189],
  [36.96, 1672099789],
  [36.96, 1672013389],
  [36.96, 1671926989],
  [36.96, 1671840589],
  [36.94, 1671754188],
  [36.96, 1671667771],
  [36.97, 1671581371],
  [36.97, 1671494971],
  [36.96, 1671408571],
  [36.96, 1671322171],
  [36.96, 1671235771],
  [36.95, 1671149371],
  [36.96, 1671062971],
  [36.95, 1670976558],
  [36.97, 1670945168],
  [36.97, 1670793115]
]
