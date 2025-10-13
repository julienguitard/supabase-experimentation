import { assertEquals, assertThrows } from '@std/assert'
import { formatToModifiedQuestionPayload } from './modifiedquestionpayload.ts'
import { makeMockHexCodec } from '../../test-utils/index.ts'
import type { SingleLLMResponseDTO } from '../../../packages/types/index.ts'

Deno.test('formatToModifiedQuestionPayload - success', () => {
  const hexCodec = makeMockHexCodec()
  const llmResponseDTO: SingleLLMResponseDTO = {
    response: 'This is the answer to the question',
    modified_question_id: 'modified-question-1'
  }
  
  const result = formatToModifiedQuestionPayload(llmResponseDTO, hexCodec)
  assertEquals(result.modified_question_id, 'modified-question-1')
  assertEquals(typeof result.hex_answer, 'string')
})

Deno.test('formatToModifiedQuestionPayload - missing payload', () => {
  const hexCodec = makeMockHexCodec()
  const llmResponseDTO: SingleLLMResponseDTO = {
    response: 'This is the answer'
  }
  
  assertThrows(
    () => formatToModifiedQuestionPayload(llmResponseDTO, hexCodec),
    Error,
    'Payload is required'
  )
})

