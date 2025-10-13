import type { SingleAIClient } from '../../../packages/types/index.ts'
import type { OpenAI } from 'npm:@types/openai'
import type { Anthropic } from 'npm:@anthropic-ai/sdk'
import type { DeepSeek } from 'npm:@deepseek-ai/sdk'

// Mock OpenAI client
export const makeMockOpenAIClient = (): OpenAI => ({
  chat: {
    completions: {
      create: async (params: any) => ({
        id: 'chatcmpl-test',
        object: 'chat.completion',
        created: Date.now(),
        model: params.model || 'gpt-4o-mini',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is a mock OpenAI response'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      })
    }
  },
  embeddings: {
    create: async (params: any) => ({
      object: 'list',
      data: [
        {
          object: 'embedding',
          index: 0,
          embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1)
        }
      ],
      model: params.model || 'text-embedding-3-small',
      usage: {
        prompt_tokens: 8,
        total_tokens: 8
      }
    })
  }
} as OpenAI)

// Mock Anthropic client
export const makeMockAnthropicClient = (): Anthropic => ({
  messages: {
    create: async (params: any) => ({
      id: 'msg-test',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'This is a mock Anthropic response'
        }
      ],
      model: params.model || 'claude-3-5-sonnet-20241022',
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: {
        input_tokens: 10,
        output_tokens: 20
      }
    })
  }
} as Anthropic)

// Mock DeepSeek client
export const makeMockDeepSeekClient = (): DeepSeek => ({
  chat: {
    completions: {
      create: async (params: any) => ({
        id: 'chatcmpl-deepseek-test',
        object: 'chat.completion',
        created: Date.now(),
        model: params.model || 'deepseek-chat',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is a mock DeepSeek response'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      })
    }
  }
} as DeepSeek)

// Generic mock AI client (defaults to OpenAI)
export const makeMockAIClient = (type: 'openai' | 'anthropic' | 'deepseek' = 'openai'): SingleAIClient => {
  switch (type) {
    case 'openai':
      return makeMockOpenAIClient()
    case 'anthropic':
      return makeMockAnthropicClient()
    case 'deepseek':
      return makeMockDeepSeekClient()
    default:
      return makeMockOpenAIClient()
  }
}

// Ready-to-use samples
export const sampleMockOpenAIClient = makeMockOpenAIClient()
export const sampleMockAnthropicClient = makeMockAnthropicClient()
export const sampleMockDeepSeekClient = makeMockDeepSeekClient()
export const sampleMockAIClient = sampleMockOpenAIClient

