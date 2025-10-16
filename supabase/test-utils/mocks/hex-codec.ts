import type { HexCodec } from '../../../packages/types/index.ts'

export const makeMockHexCodec = (overrides: Partial<HexCodec> = {}): HexCodec => ({
  encode: (input: string): string => {
    return ['10', '11', '12'].join('')
  },
  decode: (hexString: string): string => {
    return 'ABC'
  },
  ...overrides
})

export const sampleMockHexCodec = makeMockHexCodec()

