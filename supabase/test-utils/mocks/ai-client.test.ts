import { assertEquals, assertExists } from '@std/assert'
import { 
  makeMockOpenAIClient, 
  makeMockAnthropicClient, 
  makeMockDeepSeekClient,
  makeMockAIClient 
} from './ai-client.ts'

Deno.test('makeMockOpenAIClient - chat completions', async () => {
  const client = makeMockOpenAIClient()
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertExists(response.choices)
  assertEquals(response.choices.length, 1)
  assertEquals(response.choices[0].message.role, 'assistant')
  assertEquals(response.choices[0].message.content, 'This is a mock OpenAI response')
})

Deno.test('makeMockOpenAIClient - embeddings', async () => {
  const client = makeMockOpenAIClient()
  
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: 'test text'
  })
  
  assertExists(response.data)
  assertEquals(response.data.length, 1)
  assertEquals(response.data[0].embedding.length, 1536)
})

Deno.test('makeMockAnthropicClient - messages', async () => {
  const client = makeMockAnthropicClient()
  
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertExists(response.content)
  assertEquals(response.role, 'assistant')
  assertEquals(response.content[0].type, 'text')
  assertEquals(response.content[0].text, 'This is a mock Anthropic response')
})

Deno.test('makeMockDeepSeekClient - chat completions', async () => {
  const client = makeMockDeepSeekClient()
  
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertExists(response.choices)
  assertEquals(response.choices.length, 1)
  assertEquals(response.choices[0].message.role, 'assistant')
  assertEquals(response.choices[0].message.content, 'This is a mock DeepSeek response')
})

Deno.test('makeMockAIClient - defaults to OpenAI', async () => {
  const client = makeMockAIClient()
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertEquals(response.choices[0].message.content, 'This is a mock OpenAI response')
})

Deno.test('makeMockAIClient - OpenAI type', async () => {
  const client = makeMockAIClient('openai')
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertEquals(response.choices[0].message.content, 'This is a mock OpenAI response')
})

Deno.test('makeMockAIClient - Anthropic type', async () => {
  const client = makeMockAIClient('anthropic')
  
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertEquals(response.content[0].text, 'This is a mock Anthropic response')
})

Deno.test('makeMockAIClient - DeepSeek type', async () => {
  const client = makeMockAIClient('deepseek')
  
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  })
  
  assertEquals(response.choices[0].message.content, 'This is a mock DeepSeek response')
})

