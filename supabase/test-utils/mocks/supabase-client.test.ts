import { assertEquals, assertExists } from '@std/assert'
import { 
  makeMockSupabaseClient, 
  makeMockSupabaseClientWithError,
  makeMockSupabaseClientWithData 
} from './supabase-client.ts'

Deno.test('makeMockSupabaseClient - select all', async () => {
  const client = makeMockSupabaseClientWithData({
    test_table: [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ]
  })
  
  const { data, error } = await client.from('test_table').select()
  assertExists(data)
  assertEquals(data.length, 2)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - select with filter', async () => {
  const client = makeMockSupabaseClientWithData({
    test_table: [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ]
  })
  
  const { data, error } = await client.from('test_table').select().eq('id', '1')
  assertExists(data)
  assertEquals(data.length, 1)
  assertEquals(data[0].id, '1')
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - insert single row', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.from('test_table').insert({
    id: '1',
    name: 'New Item'
  })
  
  assertExists(data)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - insert multiple rows', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.from('test_table').insert([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ])
  
  assertExists(data)
  assertEquals(data.length, 2)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - update', async () => {
  const client = makeMockSupabaseClientWithData({
    test_table: [
      { id: '1', name: 'Old Name' }
    ]
  })
  
  const { data, error } = await client.from('test_table').update({ name: 'New Name' }).eq('id', '1')
  assertExists(data)
  assertEquals(data[0].name, 'New Name')
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - delete', async () => {
  const client = makeMockSupabaseClientWithData({
    test_table: [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ]
  })
  
  const { data, error } = await client.from('test_table').delete().eq('id', '1')
  assertExists(data)
  assertEquals(data.length, 1)
  assertEquals(error, null)
  
  // Verify data was removed
  const { data: remainingData } = await client.from('test_table').select()
  assertEquals(remainingData?.length, 1)
  assertEquals(remainingData?.[0].id, '2')
})

Deno.test('makeMockSupabaseClient - rpc', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.rpc('test_function')
  assertExists(data)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - auth.getUser', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.auth.getUser()
  assertExists(data.user)
  assertEquals(data.user.email, 'test@example.com')
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - auth.signInWithPassword', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123'
  })
  
  assertExists(data.user)
  assertExists(data.session)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClientWithError - returns error', async () => {
  const mockError: PostgresError = {
    message: 'Test error',
    details: 'Error details',
    hint: 'Error hint',
    code: '23505'
  }
  
  const client = makeMockSupabaseClientWithError(mockError)
  
  const { data, error } = await client.from('test_table').select()
  assertEquals(data, null)
  assertExists(error)
  assertEquals(error.message, 'Test error')
})

Deno.test('makeMockSupabaseClient - storage upload', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.storage.from('bucket').upload('path/to/file.txt', 'content')
  assertExists(data)
  assertEquals(data.path, 'path/to/file.txt')
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - storage download', async () => {
  const client = makeMockSupabaseClient()
  
  const { data, error } = await client.storage.from('bucket').download('path/to/file.txt')
  assertExists(data)
  assertEquals(error, null)
})

Deno.test('makeMockSupabaseClient - custom user', async () => {
  const customUser = {
    id: 'custom-user-id',
    email: 'custom@example.com',
    name: 'Custom User'
  }
  
  const client = makeMockSupabaseClient({ mockUser: customUser })
  
  const { data, error } = await client.auth.getUser()
  assertExists(data.user)
  assertEquals(data.user.id, 'custom-user-id')
  assertEquals(data.user.email, 'custom@example.com')
})

