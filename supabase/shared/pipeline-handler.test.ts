import { assertEquals, assertExists } from '@std/assert'
import { createPipeline, handleDenoFunction } from './pipeline-handler.ts'

Deno.test('createPipeline - select-table', () => {
  const pipeline = createPipeline('select-table')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - select-row', () => {
  const pipeline = createPipeline('select-row')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - insert-links', () => {
  const pipeline = createPipeline('insert-links')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - update-links', () => {
  const pipeline = createPipeline('update-links')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - delete-links', () => {
  const pipeline = createPipeline('delete-links')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - fetch-links', () => {
  const pipeline = createPipeline('fetch-links')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - summarize-links', () => {
  const pipeline = createPipeline('summarize-links')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - check-fragments', () => {
  const pipeline = createPipeline('check-fragments')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - chunk-fragments', () => {
  const pipeline = createPipeline('chunk-fragments')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - vectorize-chunks', () => {
  const pipeline = createPipeline('vectorize-chunks')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - insert-questions', () => {
  const pipeline = createPipeline('insert-questions')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - update-questions', () => {
  const pipeline = createPipeline('update-questions')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - delete-questions', () => {
  const pipeline = createPipeline('delete-questions')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('createPipeline - answer-questions', () => {
  const pipeline = createPipeline('answer-questions')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
})

Deno.test('handleDenoFunction - creates handler function', () => {
  const handler = handleDenoFunction('select-table')
  
  assertExists(handler)
  assertEquals(typeof handler, 'function')
})

Deno.test('handleDenoFunction - handler is async', () => {
  const handler = handleDenoFunction('select-table')
  const mockRequest = new Request('https://example.com?table=users')
  
  const result = handler(mockRequest)
  assertEquals(result instanceof Promise, true)
})

