import type { Tokenizer } from '../../../packages/types/index.ts'

//TO DO improve this mock

export const makeMockTokenizer = (overrides: Partial<Tokenizer> = {}): Tokenizer => ({
  encode: (input: string): number[] => {
    // Simple mock: convert each character to its char code
    return [65, 66, 67]
  },
  decode: (tokens: number[]): string => {
    // Simple mock: convert char codes back to string
    return 'ABC'
  },
  listSlice: (input: number[]): { start: number; end: number }[] => {
    // Simple mock: create chunks of 10 tokens
    const slices: { start: number; end: number }[] = [{ start: 0, end: 10}, { start: 10, end:  20}];
    return slices;
  },
  applyListSlice: (
    input: number[],
    slicesList: { start: number; end: number }[]
  ): { chunk_: number[]; start_: number; end_: number; length_: number }[] => {
    const chunks: { chunk_: number[]; start_: number; end_: number; length_: number }[] = [{ chunk_: [65, 66, 67], start_: 0, end_: 10, length_: 10}, { chunk_: [68, 69, 70], start_: 10, end_: 20, length_: 10}];
    return chunks;
  },
  chunkContent: (input: string): { chunk: string; start_: number; end_: number; length_: number }[] => {

    const chunks: { chunk: string; start_: number; end_: number; length_: number }[] = [{ chunk: 'hello', start_: 0, end_: 5, length_: 5}, { chunk: 'world', start_: 6, end_: 11, length_: 5}];
    return chunks;

  },
  chunkHexContent: (
    input: string,
    x?: Record<string, any>
  ): { x: any; chunk: string; start_: number; end_: number; length_: number }[] => {
    const chunks: { x: any; chunk: string; start_: number; end_: number; length_: number }[] = [{ x: x || {}, chunk: '101112', start_: 0, end_: 6, length_: 6}];
    return chunks
  },
  ...overrides
})

export const sampleMockTokenizer = makeMockTokenizer()

