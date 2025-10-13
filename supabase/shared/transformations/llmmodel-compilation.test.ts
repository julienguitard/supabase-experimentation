import { assertEquals, assertExists } from '@std/assert'
import { invokeSingleClient, vectorizeWithSingleClient } from './llmmodel-compilation.ts'
import type { SingleLLMRequestDTO, SingleEmbeddingRequestDTO, OpenAI } from '@types'

Deno.test('invokeSingleClient - OpenAI', async () => {
  const mockOpenAIClient = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: 'Test response' } }]
        })
      }
    }
  } as any
  
  const request: SingleLLMRequestDTO = {
    model: 'gpt-4o-mini',
    maxToken: 100,
    temperature: 0.7,
    messages: [{ role: 'user', content: 'Hello' }]
  }
  
  const result = await invokeSingleClient(mockOpenAIClient, request)
  assertEquals(result, 'Test response')
})

Deno.test('invokeSingleClient - error handling', async () => {
  const mockOpenAIClient = {
    chat: {
      completions: {
        create: async () => {
          throw new Error('API Error')
        }
      }
    }
  } as any
  
  const request: SingleLLMRequestDTO = {
    model: 'gpt-4o-mini',
    maxToken: 100,
    messages: [{ role: 'user', content: 'Hello' }]
  }
  
  const result = await invokeSingleClient(mockOpenAIClient, request)
  assertEquals(result, 'API Error')
})

Deno.test('vectorizeWithSingleClient', async () => {
  const mockOpenAIClient = {
    embeddings: {
      create: async () => ({
        data: [{ embedding: [0.1, 0.2, 0.3] }]
      })
    }
  } as OpenAI
  
  const request: SingleEmbeddingRequestDTO = {
    model: 'text-embedding-3-small',
    input: 'test text'
  }
  
  const result = await vectorizeWithSingleClient(mockOpenAIClient, request)
  assertEquals(result, [0.1, 0.2, 0.3])
})

