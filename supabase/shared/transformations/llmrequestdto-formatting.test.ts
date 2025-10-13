import { assertEquals } from '@std/assert'
import { formatMessageForSummarizingContent, formatMessageForModifyingQuestions, formatMessageForAnsweringQuestions } from './llmrequestdto-formatting.ts'
import { makeMockHexCodec } from '../../test-utils/index.ts'

Deno.test('formatMessageForSummarizingContent', () => {
  const hexCodec = makeMockHexCodec()
  const hexContent = hexCodec.encode('<html><body>Test content</body></html>')
  const category = 'technology'
  
  const messages = formatMessageForSummarizingContent(hexCodec, hexContent, category)
  assertEquals(messages.length, 2)
  assertEquals(messages[0].role, 'system')
  assertEquals(messages[1].role, 'user')
})

Deno.test('formatMessageForModifyingQuestions', () => {
  const hexCodec = makeMockHexCodec()
  const hexQuestion = hexCodec.encode('What is AI?')
  const hexChunks = [
    hexCodec.encode('Chunk 1 content'),
    hexCodec.encode('Chunk 2 content')
  ]
  
  const messages = formatMessageForModifyingQuestions(hexCodec, hexQuestion, hexChunks)
  assertEquals(messages.length, 2)
  assertEquals(messages[0].role, 'system')
  assertEquals(messages[1].role, 'user')
})

Deno.test('formatMessageForAnsweringQuestions', () => {
  const hexCodec = makeMockHexCodec()
  const hexModifiedQuestion = hexCodec.encode('What is artificial intelligence?')
  const hexChunks = [
    hexCodec.encode('AI is a field of computer science'),
    hexCodec.encode('Machine learning is part of AI')
  ]
  
  const messages = formatMessageForAnsweringQuestions(hexCodec, hexModifiedQuestion, hexChunks)
  assertEquals(messages.length, 3)
  assertEquals(messages[0].role, 'system')
  assertEquals(messages[1].role, 'assistant')
  assertEquals(messages[2].role, 'user')
})

