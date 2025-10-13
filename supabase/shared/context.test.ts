import { assertEquals, assertExists } from '@std/assert'
import { createClientsContext } from './context.ts'

Deno.test('createClientsContext - fetch-links', () => {
  const ctx = createClientsContext('fetch-links')
  
  assertExists(ctx)
  assertExists(ctx.browserlessClient)
  assertExists(ctx.hexCodec)
})

Deno.test('createClientsContext - summarize-links', () => {
  const ctx = createClientsContext('summarize-links')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
  assertExists(ctx.aiClient)
})

Deno.test('createClientsContext - chunk-fragments', () => {
  const ctx = createClientsContext('chunk-fragments')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
  assertExists(ctx.tokenizer)
})

Deno.test('createClientsContext - vectorize-chunks', () => {
  const ctx = createClientsContext('vectorize-chunks')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
  assertExists(ctx.aiClient)
})

Deno.test('createClientsContext - insert-questions', () => {
  const ctx = createClientsContext('insert-questions')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
})

Deno.test('createClientsContext - update-questions', () => {
  const ctx = createClientsContext('update-questions')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
})

Deno.test('createClientsContext - delete-questions', () => {
  const ctx = createClientsContext('delete-questions')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
})

Deno.test('createClientsContext - answer-questions', () => {
  const ctx = createClientsContext('answer-questions')
  
  assertExists(ctx)
  assertExists(ctx.hexCodec)
  assertExists(ctx.aiClient)
})

Deno.test('createClientsContext - unknown name returns empty context', () => {
  const ctx = createClientsContext('unknown')
  
  assertExists(ctx)
  assertEquals(Object.keys(ctx).length, 0)
})

Deno.test('createClientsContext - hexCodec can encode and decode', () => {
  const ctx = createClientsContext('insert-questions')
  
  const original = 'Test string'
  const encoded = ctx.hexCodec!.encode(original)
  const decoded = ctx.hexCodec!.decode(encoded)
  
  assertEquals(decoded, original)
})

Deno.test('createClientsContext - tokenizer has required methods', () => {
  const ctx = createClientsContext('chunk-fragments')
  
  assertExists(ctx.tokenizer?.encode)
  assertExists(ctx.tokenizer?.decode)
  assertExists(ctx.tokenizer?.listSlice)
  assertExists(ctx.tokenizer?.applyListSlice)
  assertExists(ctx.tokenizer?.chunkContent)
  assertExists(ctx.tokenizer?.chunkHexContent)
})

