import { assertEquals, assertExists } from '@std/assert'
import { executeSelectQuery, executeInsertInCacheTableQuery, executeFunction } from './dbquery-execution.ts'
import type { DBResponseDTO } from '../../../packages/types/index.ts'
import { makeMockDBClient } from '../../test-utils/index.ts'

Deno.test('executeSelectQuery - without id', async () => {
  const mockClient = makeMockDBClient()
  
  const result = await executeSelectQuery(mockClient as any, 'test_table')
  assertExists(result.data)
  assertEquals(result.error, null)
})

Deno.test('executeSelectQuery - with id', async () => {
  const mockClient = {
    from: (table: string) => ({
      select: (fields: string) => ({
        eq: (column: string, value: string) => ({
          then: (resolve: any) => resolve({ data: [{ id: '1', name: 'test' }], error: null })
        })
      })
    })
  }
  
  const result = await executeSelectQuery(mockClient as any, 'test_table', '1')
  assertExists(result.data)
  assertEquals(result.error, null)
})

Deno.test('executeInsertInCacheTableQuery', async () => {
  const mockClient = {
    from: (table: string) => ({
      insert: (rows: any[]) => ({
        then: (resolve: any) => resolve({ data: null, error: null })
      })
    }),
    rpc: (functionName: string) => ({
      then: (resolve: any) => resolve({ data: [{ id: '1' }], error: null })
    })
  }
  
  const result = await executeInsertInCacheTableQuery(
    mockClient as any,
    'cache_table',
    [{ id: '1' }],
    'test_function'
  )
  assertExists(result.data)
})

Deno.test('executeFunction', async () => {
  const mockClient = {
    rpc: (functionName: string) => ({
      then: (resolve: any) => resolve({ data: [{ result: 'success' }], error: null })
    })
  }
  
  const result = await executeFunction(mockClient as any, 'test_function')
  assertExists(result.data)
  assertEquals(result.error, null)
})

