import type { TextCodec } from '../../../packages/types/index.ts'

export const makeMockTextCodec = (overrides: Partial<TextCodec> = {}): TextCodec => ({
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  ...overrides
})

export const sampleMockTextCodec = makeMockTextCodec()

