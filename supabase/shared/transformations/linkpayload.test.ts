import { assertEquals, assertThrows, assertExists } from '@std/assert'
import { translateSingleScrapableDTO, fetchSingleScrapable, formatToLinkPayload } from './linkpayload.ts'
import { makeMockBrowserlessClient, makeMockHexCodec, makeSingleScrapableDTO } from '../../test-utils/index.ts'
import type { SingleScrapedDTO } from '../../../packages/types/index.ts'

Deno.test('translateSingleScrapableDTO', () => {
  const browserlessClient = makeMockBrowserlessClient()
  const scrapableDTO = makeSingleScrapableDTO({
    method: 'GET',
    url: 'https://example.com',
    link_id: 'link-1'
  })
  
  const result = translateSingleScrapableDTO(scrapableDTO, browserlessClient)
  assertEquals(result.method, 'POST')
  assertEquals(result.url, browserlessClient.url)
  assertExists(result.body)
})

Deno.test('formatToLinkPayload - with error', () => {
  const hexCodec = makeMockHexCodec()
  const scrapedDTO: SingleScrapedDTO = {
    status: 404,
    headers: {},
    body: 'Not found',
    error: 'Not Found',
    link_id: 'link-1'
  }
  
  const result = formatToLinkPayload(scrapedDTO, hexCodec)
  assertEquals(result.link_id, 'link-1')
  assertEquals(result.status, 404)
  assertExists(result.hex_content)
  assertExists(result.hex_error)
})

Deno.test('formatToLinkPayload - without error', () => {
  const hexCodec = makeMockHexCodec()
  const scrapedDTO: SingleScrapedDTO = {
    status: 200,
    headers: {},
    body: 'Success',
    link_id: 'link-1'
  }
  
  const result = formatToLinkPayload(scrapedDTO, hexCodec)
  assertEquals(result.link_id, 'link-1')
  assertEquals(result.status, 200)
  assertExists(result.hex_content)
  assertEquals(result.hex_error, null)
})

Deno.test('formatToLinkPayload - missing payload', () => {
  const hexCodec = makeMockHexCodec()
  const scrapedDTO: SingleScrapedDTO = {
    status: 200,
    headers: {},
    body: 'Success'
  }
  
  assertThrows(
    () => formatToLinkPayload(scrapedDTO, hexCodec),
    Error,
    'Payload is required'
  )
})

