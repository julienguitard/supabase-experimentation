import type { Env, Option } from '../../../packages/types/index.ts'

export const makeMockEnv = (overrides: Partial<Env> = {}): Env => ({
  get: (key: string): Option<string> => {
    const defaults: Record<string, string> = {
      'TEST_KEY': 'test-value',
      'API_URL': 'https://api.test.com'
    }
    return defaults[key] ?? null
  },
  ...overrides
})

export const sampleMockEnv = makeMockEnv()

