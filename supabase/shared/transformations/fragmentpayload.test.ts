import { assertEquals, assertThrows } from '@std/assert'
import { executeSingleTokenizableWithHexFragmentDTO, formatToFragmentPayload } from './fragmentpayload.ts'
import { makeMockTokenizer } from '../../test-utils/index.ts'
import type { SingleTokenizableDTOWithHexFragment, SingleTokenizedDTOWithHexFragment } from '../../../packages/types/index.ts'

Deno.test('executeSingleTokenizableWithHexFragmentDTO', () => {
  const tokenizer = makeMockTokenizer()
  const tokenizableDTO: SingleTokenizableDTOWithHexFragment = {
    hex_fragment: '48656c6c6f',
    fragment_id: 'fragment-1'
  }
  
  const result = executeSingleTokenizableWithHexFragmentDTO(tokenizer, tokenizableDTO)
  assertEquals(Array.isArray(result), true)
})

Deno.test('formatToFragmentPayload - success', () => {
  const tokenizedDTO: SingleTokenizedDTOWithHexFragment = {
    hex_chunk: '48656c6c6f',
    start_: 0,
    end_: 5,
    length_: 5,
    fragment_id: 'fragment-1'
  }
  
  const result = formatToFragmentPayload(tokenizedDTO)
  assertEquals(result.fragment_id, 'fragment-1')
  assertEquals(result.hex_chunk, '48656c6c6f')
  assertEquals(result.start_, 0)
  assertEquals(result.end_, 5)
  assertEquals(result.length_, 5)
})

Deno.test('formatToFragmentPayload - missing payload', () => {
  const tokenizedDTO: SingleTokenizedDTOWithHexFragment = {
    hex_chunk: '48656c6c6f',
    start_: 0,
    end_: 5,
    length_: 5
  }
  
  assertThrows(
    () => formatToFragmentPayload(tokenizedDTO as any),
    Error,
    'Payload is required'
  )
})

