import type { LLMModel, SingleLLMRequestDTO } from '../../../packages/types/index.ts'
import { makeSingleLLMRequestDTO } from '../fixtures/dtos.ts'

export const makeMockLLMModel = <M extends Record<string, string>>(
  overrides: Partial<LLMModel<M>> = {}
): LLMModel<M> => ({
  llmRequestDTO: makeSingleLLMRequestDTO(),
  invoke: async (singleLLMRequestDTO: SingleLLMRequestDTO): Promise<string> => {
    // Simple mock: return a canned response based on the model
    const model = singleLLMRequestDTO.model
    if (model.includes('gpt')) {
      return 'This is a mock OpenAI response'
    } else if (model.includes('claude')) {
      return 'This is a mock Anthropic response'
    } else if (model.includes('deepseek')) {
      return 'This is a mock DeepSeek response'
    }
    return 'This is a mock LLM response'
  },
  ...overrides
})

export const sampleMockLLMModel = makeMockLLMModel()

