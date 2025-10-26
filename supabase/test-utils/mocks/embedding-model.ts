import type { EmbeddingModel, SingleEmbeddingRequestDTO } from '../../../packages/types/index.ts'
import { makeSingleEmbeddingRequestDTO } from '../fixtures/dtos.ts'

export const makeMockEmbeddingModel = (
  overrides: Partial<EmbeddingModel> = {}
): EmbeddingModel => ({
  embeddingRequestDTO: makeSingleEmbeddingRequestDTO(),
  vectorize: async (singleEmbeddingRequestDTO: SingleEmbeddingRequestDTO): Promise<number[]> => {
    // Simple mock: return a fixed-size embedding vector
    const vectorSize = 1536 // Common size for OpenAI embeddings
    return Array(vectorSize).fill(0).map((i) => 0.5 * (-1) ** i )
  },
  ...overrides
})

export const sampleMockEmbeddingModel = makeMockEmbeddingModel()

