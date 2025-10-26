import { 
  createSupabaseClient,
  createAuthenticatedSupabaseClient,
  createBrowserlessClient,
  createBrowserFactory,
  createTextCodec,
  createHexCodec,
  createTokenEncoder,
  createTokenizer,
  createAnthropicClient,
  createOpenAIClient,
  createUser,
  createMarkdownReader
} from './context-elements.ts'
import { makeMockEnv } from '../test-utils/index.ts'
import type { Env } from '../../packages/types/index.ts'

Deno.test('createSupabaseClient - creates client with env variables', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'SUPABASE_URL') return 'https://test.supabase.co'
      if (key === 'SUPABASE_ANON_KEY') return 'test-anon-key'
      return null
    }
  })
  
  const client = createSupabaseClient(mockEnv)
  assertExists(client)
})

Deno.test('createAuthenticatedSupabaseClient - creates client with auth header', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'SUPABASE_URL') return 'https://test.supabase.co'
      if (key === 'SUPABASE_ANON_KEY') return 'test-anon-key'
      return null
    }
  })
  
  const mockRequest = new Request('https://example.com', {
    headers: { 'Authorization': 'Bearer test-token' }
  })
  
  const client = createAuthenticatedSupabaseClient(mockEnv, mockRequest)
  assertExists(client)
})

Deno.test('createBrowserlessClient - creates client with API key', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'BROWSERLESS_API_KEY') return 'test-api-key'
      return null
    }
  })
  
  const client = createBrowserlessClient(mockEnv)
  assertExists(client)
  assertExists(client.url)
  assertExists(client.headers)
  assertExists(client.completeBody)
  assertEquals(client.url.includes('test-api-key'), true)
})

Deno.test('createBrowserlessClient - completeBody returns correct structure', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'BROWSERLESS_API_KEY') return 'test-api-key'
      return null
    }
  })
  
  const client = createBrowserlessClient(mockEnv)
  const result = client.completeBody('https://example.com')
  
  assertEquals(result.url, 'https://example.com')
  assertExists(result.elements)
  assertEquals(Array.isArray(result.elements), true)
  assertEquals(result.elements.length > 0, true)
  assertEquals(result.elements[0].selector, 'p')
})

Deno.test('createBrowserFactory - creates factory with browser method', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'BROWSERLESS_API_KEY') return 'test-api-key'
      return null
    }
  })
  
  const factory = createBrowserFactory(mockEnv)
  assertExists(factory)
  assertExists(factory.browser)
  assertEquals(typeof factory.browser, 'function')
})

Deno.test('createTextCodec - creates text encoder and decoder', () => {
  const codec = createTextCodec()
  
  assertExists(codec)
  assertExists(codec.textEncoder)
  assertExists(codec.textDecoder)
  assertEquals(codec.textEncoder instanceof TextEncoder, true)
  assertEquals(codec.textDecoder instanceof TextDecoder, true)
})

Deno.test('createHexCodec - encodes string to hex', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  
  const input = 'Hello'
  const encoded = hexCodec.encode(input)
  
  assertExists(encoded)
  assertEquals(typeof encoded, 'string')
  // 'Hello' in hex is '48656c6c6f'
  assertEquals(encoded, '48656c6c6f')
})

Deno.test('createHexCodec - decodes hex to string', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  
  const hexInput = '48656c6c6f'
  const decoded = hexCodec.decode(hexInput)
  
  assertEquals(decoded, 'Hello')
})

Deno.test('createHexCodec - encode and decode round trip', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  
  const original = 'The quick brown fox jumps over the lazy dog'
  const encoded = hexCodec.encode(original)
  const decoded = hexCodec.decode(encoded)
  
  assertEquals(decoded, original)
})

Deno.test('createTokenEncoder - creates tiktoken encoder', () => {
  const encoder = createTokenEncoder('gpt-4o')
  
  assertExists(encoder)
  assertExists(encoder.encode)
  assertExists(encoder.decode)
})

Deno.test('createTokenEncoder - encodes text to tokens', () => {
  const encoder = createTokenEncoder('gpt-4o')
  const tokens = encoder.encode('Hello world')
  
  assertExists(tokens)
  assertEquals(Array.isArray(tokens), true)
  assertEquals(tokens.length > 0, true)
})

Deno.test('createTokenizer - creates tokenizer with all methods', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  const encoder = createTokenEncoder('gpt-4o')
  const tokenizer = createTokenizer(encoder, textCodec, hexCodec)
  
  assertExists(tokenizer)
  assertExists(tokenizer.encode)
  assertExists(tokenizer.decode)
  assertExists(tokenizer.listSlice)
  assertExists(tokenizer.applyListSlice)
  assertExists(tokenizer.chunkContent)
  assertExists(tokenizer.chunkHexContent)
})

Deno.test('createTokenizer - encode and decode', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  const encoder = createTokenEncoder('gpt-4o')
  const tokenizer = createTokenizer(encoder, textCodec, hexCodec)
  
  const text = 'Hello world'
  const tokens = tokenizer.encode(text)
  const decoded = tokenizer.decode(tokens)
  
  assertEquals(decoded, text)
})

Deno.test('createTokenizer - listSlice creates slices', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  const encoder = createTokenEncoder('gpt-4o')
  const tokenizer = createTokenizer(encoder, textCodec, hexCodec)
  
  const tokens = Array(500).fill(1)
  const slices = tokenizer.listSlice(tokens)
  
  assertEquals(Array.isArray(slices), true)
  assertEquals(slices.length > 0, true)
  assertEquals(slices[0].start, 0)
  assertEquals(slices[0].end, 256)
})

Deno.test('createTokenizer - chunkContent creates chunks', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  const encoder = createTokenEncoder('gpt-4o')
  const tokenizer = createTokenizer(encoder, textCodec, hexCodec)
  
  const text = 'Hello world, this is a test.'
  const chunks = tokenizer.chunkContent(text)
  
  assertEquals(Array.isArray(chunks), true)
  assertEquals(chunks.length > 0, true)
  assertExists(chunks[0].chunk)
  assertExists(chunks[0].start_)
  assertExists(chunks[0].end_)
})

Deno.test('createTokenizer - chunkHexContent creates hex chunks', () => {
  const textCodec = createTextCodec()
  const hexCodec = createHexCodec(textCodec)
  const encoder = createTokenEncoder('gpt-4o')
  const tokenizer = createTokenizer(encoder, textCodec, hexCodec)
  
  const text = 'Hello world'
  const hexText = hexCodec.encode(text)
  const chunks = tokenizer.chunkHexContent(hexText, { id: 'test-id' })
  
  assertEquals(Array.isArray(chunks), true)
  assertEquals(chunks.length > 0, true)
  assertExists(chunks[0].hex_chunk)
  assertEquals(chunks[0].id, 'test-id')
})

Deno.test('createAnthropicClient - creates client with API key', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'ANTHROPIC_API_KEY') return 'test-anthropic-key'
      return null
    }
  })
  
  const client = createAnthropicClient(mockEnv)
  assertExists(client)
})

Deno.test('createOpenAIClient - creates client with API key', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-openai-key'
      return null
    }
  })
  
  const client = createOpenAIClient(mockEnv)
  assertExists(client)
})

Deno.test('createUser - creates user from env variables', () => {
  const mockEnv = makeMockEnv({
    get: (key: string) => {
      if (key === 'TEST_EMAIL') return 'test@example.com'
      if (key === 'TEST_PWD') return 'password123'
      return null
    }
  })
  
  const user = createUser(mockEnv)
  assertExists(user)
  assertEquals(user?.email, 'test@example.com')
})

Deno.test('createUser - returns null on error', () => {
  const mockEnv = makeMockEnv({
    get: () => {
      throw new Error('Env error')
    }
  })
  
  const user = createUser(mockEnv)
  assertEquals(user, null)
})

Deno.test('createMarkdownReader - creates async reader function', () => {
  const reader = createMarkdownReader()
  
  assertExists(reader)
  assertEquals(typeof reader, 'function')
})

Deno.test('createMarkdownReader - reads file content', async () => {
  const reader = createMarkdownReader()
  
  // Create a temporary test file
  const tempFile = './test-temp-markdown.md'
  const testContent = '# Test Markdown\n\nThis is a test.'
  await Deno.writeTextFile(tempFile, testContent)
  
  try {
    const content = await reader(tempFile)
    assertEquals(content, testContent)
  } finally {
    // Clean up
    await Deno.remove(tempFile)
  }
})

Deno.test('createMarkdownReader - throws error for non-existent file', async () => {
  const reader = createMarkdownReader()
  
  try {
    await reader('./non-existent-file.md')
    throw new Error('Should have thrown an error')
  } catch (error) {
    assertEquals(error.message.includes('Failed to read markdown file'), true)
  }
})

