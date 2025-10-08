import type {
  RequestDTO,
  SingleScrapableDTO,
  SingleScrapedDTO,
  Message,
  SingleLLMRequestDTO,
  SingleLLMResponseDTO,
  SingleEmbeddingRequestDTO,
  SingleEmbeddingResponseDTO,
  DBQueryDTO,
  DBResponseDTO,
  TokenizableDTO,
  SingleTokenizableDTOWithFragment,
  SingleTokenizableDTOWithHexFragment,
  SingleTokenizedDTOWithFragment,
  SingleTokenizedDTOWithHexFragment
} from '../../../packages/types/index.ts'

// Request / Scrapable
export const makeRequestDTO = (overrides: Partial<RequestDTO> = {}): RequestDTO => ({
  method: 'GET',
  url: '/test',
  urlSearchParams: {},
  authHeader: 'Bearer test-token',
  body: undefined,
  ...overrides
})

export const makeSingleScrapableDTO = (
  overrides: Partial<SingleScrapableDTO> = {}
): SingleScrapableDTO => ({
  ...makeRequestDTO(),
  ...overrides
})

// Scraped / Responses
export const makeSingleScrapedDTO = (
  overrides: Partial<SingleScrapedDTO> = {}
): SingleScrapedDTO => ({
  status: 200,
  headers: { 'content-type': 'text/plain' },
  body: 'ok',
  ...overrides
})

// Tokenizable inputs
export const makeSingleTokenizableDTOWithFragment = (
  overrides: Partial<SingleTokenizableDTOWithFragment> = {}
): SingleTokenizableDTOWithFragment => ({
  fragment: 'Lorem ipsum dolor sit amet',
  ...overrides
})

export const makeSingleTokenizableDTOWithHexFragment = (
  overrides: Partial<SingleTokenizableDTOWithHexFragment> = {}
): SingleTokenizableDTOWithHexFragment => ({
  hex_fragment: '68656c6c6f20776f726c64',
  ...overrides
})

export const makeTokenizableDTOList = (
  items: TokenizableDTO
): TokenizableDTO => items

// Tokenized outputs
export const makeSingleTokenizedDTOWithFragment = (
  overrides: Partial<SingleTokenizedDTOWithFragment> = {}
): SingleTokenizedDTOWithFragment => ({
  chunk: 'Lorem',
  start_: 0,
  end_: 5,
  length_: 5,
  ...overrides
})

export const makeSingleTokenizedDTOWithHexFragment = (
  overrides: Partial<SingleTokenizedDTOWithHexFragment> = {}
): SingleTokenizedDTOWithHexFragment => ({
  hex_chunk: '4c6f72656d',
  start_: 0,
  end_: 5,
  length_: 5,
  ...overrides
})

// LLM request/response
export const makeMessage = (role: string, content: string): Message<string> => ({
  role,
  content
})

export const makeSingleLLMRequestDTO = (
  overrides: Partial<SingleLLMRequestDTO> = {}
): SingleLLMRequestDTO => ({
  model: 'gpt-4o-mini',
  maxToken: 1000,
  temperature: 0.5,
  messages: [
    makeMessage('system', 'You are a helpful assistant'),
    makeMessage('user', 'Say hello')
  ],
  ...overrides
})

export const makeSingleLLMResponseDTO = (
  overrides: Partial<SingleLLMResponseDTO> = {}
): SingleLLMResponseDTO => ({
  response: 'hello',
  response_type: 'text',
  ...overrides
})

// Embeddings request/response
export const makeSingleEmbeddingRequestDTO = (
  overrides: Partial<SingleEmbeddingRequestDTO> = {}
): SingleEmbeddingRequestDTO => ({
  model: 'text-embedding-3-small',
  input: 'hello world',
  ...overrides
})

export const makeSingleEmbeddingResponseDTO = (
  overrides: Partial<SingleEmbeddingResponseDTO> = {}
): SingleEmbeddingResponseDTO => ({
  embeddings: [0.01, 0.02, 0.03],
  ...overrides
})

// DB layer DTOs
export const makeDBQueryDTO = (overrides: Partial<DBQueryDTO> = {}): DBQueryDTO => ({
  statement: 'select',
  table: 'example_table',
  id: undefined,
  cacheTable: undefined,
  rows: undefined,
  SQLFunction: undefined,
  ...overrides
})

export const makeDBResponseDTO = <T>(
  overrides: Partial<DBResponseDTO<T>> = {}
): DBResponseDTO<T> => ({
  data: [] as T[],
  error: undefined,
  ...overrides
})

// Handy ready-to-use samples
export const sampleRequestDTO = makeRequestDTO()
export const sampleSingleScrapableDTO = makeSingleScrapableDTO()
export const sampleSingleScrapedDTO = makeSingleScrapedDTO()
export const sampleSingleTokenizableWithFragment = makeSingleTokenizableDTOWithFragment()
export const sampleSingleTokenizableWithHexFragment = makeSingleTokenizableDTOWithHexFragment()
export const sampleSingleTokenizedWithFragment = makeSingleTokenizedDTOWithFragment()
export const sampleSingleTokenizedWithHexFragment = makeSingleTokenizedDTOWithHexFragment()
export const sampleSingleLLMRequestDTO = makeSingleLLMRequestDTO()
export const sampleSingleLLMResponseDTO = makeSingleLLMResponseDTO()
export const sampleSingleEmbeddingRequestDTO = makeSingleEmbeddingRequestDTO()
export const sampleSingleEmbeddingResponseDTO = makeSingleEmbeddingResponseDTO()
export const sampleDBQueryDTO = makeDBQueryDTO()

