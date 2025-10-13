import { assertEquals, assertThrows } from '@std/assert'
import { formatToMatchPayload } from './matchpayload.ts'
import { makeMockHexCodec } from '../../test-utils/index.ts'
import type { SingleLLMResponseDTO } from '../../../packages/types/index.ts'

Deno.test('formatToMatchPayload - success', () => {
  const hexCodec = makeMockHexCodec()
  const llmResponseDTO: SingleLLMResponseDTO = {
    response: 'What is artificial intelligence?',
    match_id: 'match-1'
  }
  
  const result = formatToMatchPayload(llmResponseDTO, hexCodec)
  assertEquals(result.match_id, 'match-1')
  assertEquals(typeof result.hex_modified_question, 'string')
})

Deno.test('formatToMatchPayload - missing payload', () => {
  const hexCodec = makeMockHexCodec()
  const llmResponseDTO: SingleLLMResponseDTO = {
    response: 'What is artificial intelligence?'
  }
  
  assertThrows(
    () => formatToMatchPayload(llmResponseDTO, hexCodec),
    Error,
    'Payload is required'
  )
})

