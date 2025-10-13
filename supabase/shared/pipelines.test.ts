import { assertEquals, assertExists, assertThrows } from '@std/assert'
import { getPipelineGenerator } from './pipelines.ts'
import { makeMockSupabaseClient, makeMockHexCodec, makeMockOpenAIClient, makeMockBrowserlessClient, makeMockTokenizer } from '../test-utils/index.ts'

Deno.test('getPipelineGenerator - select-table returns pipeline', () => {
  const pipeline = getPipelineGenerator('select-table')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
  
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - select-row returns pipeline', () => {
  const pipeline = getPipelineGenerator('select-row')
  
  assertExists(pipeline)
  assertEquals(typeof pipeline, 'function')
  
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - insert-links returns pipeline', () => {
  const pipeline = getPipelineGenerator('insert-links')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - update-links returns pipeline', () => {
  const pipeline = getPipelineGenerator('update-links')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - delete-links returns pipeline', () => {
  const pipeline = getPipelineGenerator('delete-links')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - fetch-links returns pipeline', () => {
  const pipeline = getPipelineGenerator('fetch-links')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockBrowserless = makeMockBrowserlessClient()
  const mockHexCodec = makeMockHexCodec()
  const steps = pipeline(mockClient, mockBrowserless, mockHexCodec)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 11)
})

Deno.test('getPipelineGenerator - summarize-links returns pipeline', () => {
  const pipeline = getPipelineGenerator('summarize-links')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const mockAiClient = makeMockOpenAIClient()
  const steps = pipeline(mockClient, mockHexCodec, mockAiClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 11)
})

Deno.test('getPipelineGenerator - check-fragments returns pipeline', () => {
  const pipeline = getPipelineGenerator('check-fragments')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - chunk-fragments returns pipeline', () => {
  const pipeline = getPipelineGenerator('chunk-fragments')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const mockTokenizer = makeMockTokenizer()
  const steps = pipeline(mockClient, mockHexCodec, mockTokenizer)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 11)
})

Deno.test('getPipelineGenerator - vectorize-chunks returns pipeline', () => {
  const pipeline = getPipelineGenerator('vectorize-chunks')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const mockOpenAI = makeMockOpenAIClient()
  const steps = pipeline(mockClient, mockHexCodec, mockOpenAI)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 11)
})

Deno.test('getPipelineGenerator - insert-questions returns pipeline', () => {
  const pipeline = getPipelineGenerator('insert-questions')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const steps = pipeline(mockClient, mockHexCodec)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - update-questions returns pipeline', () => {
  const pipeline = getPipelineGenerator('update-questions')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const steps = pipeline(mockClient, mockHexCodec)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - delete-questions returns pipeline', () => {
  const pipeline = getPipelineGenerator('delete-questions')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const steps = pipeline(mockClient, mockHexCodec)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 5)
})

Deno.test('getPipelineGenerator - answer-questions returns pipeline', () => {
  const pipeline = getPipelineGenerator('answer-questions')
  
  assertExists(pipeline)
  const mockClient = makeMockSupabaseClient()
  const mockHexCodec = makeMockHexCodec()
  const mockAiClient = makeMockOpenAIClient()
  const steps = pipeline(mockClient, mockHexCodec, mockAiClient)
  
  assertEquals(Array.isArray(steps), true)
  assertEquals(steps.length, 15)
})

Deno.test('getPipelineGenerator - unknown pipeline throws error', () => {
  assertThrows(
    () => getPipelineGenerator('unknown-pipeline'),
    Error,
    'Unknown pipeline name'
  )
})

Deno.test('getPipelineGenerator - all steps are functions', () => {
  const pipeline = getPipelineGenerator('select-table')
  const mockClient = makeMockSupabaseClient()
  const steps = pipeline(mockClient)
  
  steps.forEach((step, index) => {
    assertEquals(typeof step, 'function', `Step ${index} should be a function`)
  })
})

