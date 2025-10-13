import type { HexCodec } from '../../../packages/types/index.ts'

export const makeMockHexCodec = (overrides: Partial<HexCodec> = {}): HexCodec => ({
  encode: (input: string): string => {
    return Array.from(input)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  },
  decode: (hexString: string): string => {
    const pairs = hexString.match(/.{1,2}/g) || []
    return pairs
      .map(pair => String.fromCharCode(parseInt(pair, 16)))
      .join('')
  },
  ...overrides
})

export const sampleMockHexCodec = makeMockHexCodec()

