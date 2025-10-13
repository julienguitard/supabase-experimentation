import type { Tokenizer } from '../../../packages/types/index.ts'

//TO DO improve this mock

export const makeMockTokenizer = (overrides: Partial<Tokenizer> = {}): Tokenizer => ({
  encode: (input: string): number[] => {
    // Simple mock: convert each character to its char code
    return Array.from(input).map(char => char.charCodeAt(0))
  },
  decode: (tokens: number[]): string => {
    // Simple mock: convert char codes back to string
    return tokens.map(code => String.fromCharCode(code)).join('')
  },
  listSlice: (input: number[]): { start: number; end: number }[] => {
    // Simple mock: create chunks of 10 tokens
    const chunkSize = 10
    const slices: { start: number; end: number }[] = []
    for (let i = 0; i < input.length; i += chunkSize) {
      slices.push({
        start: i,
        end: Math.min(i + chunkSize, input.length)
      })
    }
    return slices
  },
  applyListSlice: (
    input: number[],
    slicesList: { start: number; end: number }[]
  ): { chunk_: number[]; start_: number; end_: number; length_: number }[] => {
    return slicesList.map(slice => {
      const chunk_ = input.slice(slice.start, slice.end)
      return {
        chunk_,
        start_: slice.start,
        end_: slice.end,
        length_: chunk_.length
      }
    })
  },
  chunkContent: (input: string): { chunk: string; start_: number; end_: number; length_: number }[] => {
    // Simple mock: split into words
    const words = input.split(/\s+/)
    const chunks: { chunk: string; start_: number; end_: number; length_: number }[] = []
    let position = 0
    
    for (const word of words) {
      if (word) {
        chunks.push({
          chunk: word,
          start_: position,
          end_: position + word.length,
          length_: word.length
        })
        position += word.length + 1 // +1 for space
      }
    }
    
    return chunks
  },
  chunkHexContent: (
    input: string,
    x?: Record<string, any>
  ): { x: any; chunk: string; start_: number; end_: number; length_: number }[] => {
    // Simple mock: similar to chunkContent but with hex encoding
    const words = input.split(/\s+/)
    const chunks: { x: any; chunk: string; start_: number; end_: number; length_: number }[] = []
    let position = 0
    
    for (const word of words) {
      if (word) {
        const hexChunk = Array.from(word)
          .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
        
        chunks.push({
          x: x || {},
          chunk: hexChunk,
          start_: position,
          end_: position + word.length,
          length_: word.length
        })
        position += word.length + 1
      }
    }
    
    return chunks
  },
  ...overrides
})

export const sampleMockTokenizer = makeMockTokenizer()

