import { assertEquals } from '@std/assert'
import { distributeResourceDataSlice } from './resource-dataslice-distribution.ts'

Deno.test('distributeResourceDataSlice - equal distribution', () => {
  const resources = ['resource1', 'resource2', 'resource3']
  const dataSlice = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  const result = distributeResourceDataSlice(resources, dataSlice)
  assertEquals(result.length, 3)
  assertEquals(result[0][0], 'resource1')
  assertEquals(result[1][0], 'resource2')
  assertEquals(result[2][0], 'resource3')
})

Deno.test('distributeResourceDataSlice - uneven distribution', () => {
  const resources = ['A', 'B']
  const dataSlice = [1, 2, 3, 4, 5]
  
  const result = distributeResourceDataSlice(resources, dataSlice)
  assertEquals(result.length, 2)
  assertEquals(result[0][0], 'A')
  assertEquals(result[1][0], 'B')
  // Check that all data is distributed
  const totalItems = result.reduce((sum, [_, data]) => sum + data.length, 0)
  assertEquals(totalItems, 5)
})

Deno.test('distributeResourceDataSlice - single resource', () => {
  const resources = ['single']
  const dataSlice = [1, 2, 3]
  
  const result = distributeResourceDataSlice(resources, dataSlice)
  assertEquals(result.length, 1)
  assertEquals(result[0][0], 'single')
  assertEquals(result[0][1], [1, 2, 3])
})

Deno.test('distributeResourceDataSlice - more resources than data', () => {
  const resources = ['A', 'B', 'C', 'D', 'E']
  const dataSlice = [1, 2]
  
  const result = distributeResourceDataSlice(resources, dataSlice)
  assertEquals(result.length, 5)
  // Each resource should get at most 1 item
  result.forEach(([resource, data]) => {
    assertEquals(data.length <= 1, true)
  })
})

