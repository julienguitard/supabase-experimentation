import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { PostgresError } from 'jsr:@supabase/supabase-js@2'

type MockData = Record<string, any[]>

type MockClientOptions = {
  mockData?: MockData
  mockUser?: any
  mockError?: PostgresError | null
}

// Create a mock query builder that chains methods
function createMockQueryBuilder<T>(
  tableName: string,
  mockData: MockData,
  mockError: PostgresError | null
) {
  let selectedColumns = '*'
  let filterColumn: string | null = null
  let filterValue: any = null
  let insertedRows: any[] = []

  const getData = (): T[] => {
    const tableData = mockData[tableName] || []
    
    if (filterColumn && filterValue !== null) {
      return tableData.filter((row: any) => row[filterColumn] === filterValue) as T[]
    }
    
    return tableData as T[]
  }

  return {
    select: (columns = '*') => {
      selectedColumns = columns
      return {
        eq: (column: string, value: any) => {
          filterColumn = column
          filterValue = value
          return Promise.resolve({
            data: mockError ? null : getData(),
            error: mockError
          })
        },
        then: (resolve: any) => resolve({
          data: mockError ? null : getData(),
          error: mockError
        })
      }
    },
    insert: (rows: any | any[]) => {
      insertedRows = Array.isArray(rows) ? rows : [rows]
      
      // Add inserted rows to mock data
      if (!mockData[tableName]) {
        mockData[tableName] = []
      }
      mockData[tableName].push(...insertedRows)
      
      return {
        select: () => ({
          then: (resolve: any) => resolve({
            data: mockError ? null : insertedRows,
            error: mockError
          })
        }),
        then: (resolve: any) => resolve({
          data: mockError ? null : insertedRows,
          error: mockError
        })
      }
    },
    update: (values: any) => ({
      eq: (column: string, value: any) => {
        const tableData = mockData[tableName] || []
        const updated = tableData
          .filter((row: any) => row[column] === value)
          .map((row: any) => ({ ...row, ...values }))
        
        return Promise.resolve({
          data: mockError ? null : updated,
          error: mockError
        })
      },
      then: (resolve: any) => resolve({
        data: mockError ? null : [],
        error: mockError
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => {
        const tableData = mockData[tableName] || []
        const deleted = tableData.filter((row: any) => row[column] === value)
        mockData[tableName] = tableData.filter((row: any) => row[column] !== value)
        
        return Promise.resolve({
          data: mockError ? null : deleted,
          error: mockError
        })
      },
      then: (resolve: any) => resolve({
        data: mockError ? null : [],
        error: mockError
      })
    })
  }
}

export const makeMockSupabaseClient = (options: MockClientOptions = {}): SupabaseClient => {
  const { 
    mockData = {}, 
    mockUser = { id: 'test-user-id', email: 'test@example.com' },
    mockError = null 
  } = options

  return {
    from: <T>(tableName: string) => createMockQueryBuilder<T>(tableName, mockData, mockError),
    
    rpc: async (functionName: string, params?: any) => {
      // Mock RPC calls - you can customize this based on function names
      const mockRpcResults: Record<string, any> = {
        'test_function': [{ result: 'success' }],
        'get_stats': [{ count: 10, total: 100 }]
      }
      
      return {
        data: mockError ? null : (mockRpcResults[functionName] || []),
        error: mockError
      }
    },
    
    auth: {
      getUser: async () => ({
        data: {
          user: mockError ? null : mockUser
        },
        error: mockError
      }),
      signInWithPassword: async (credentials: any) => ({
        data: {
          user: mockError ? null : mockUser,
          session: mockError ? null : { access_token: 'mock-token' }
        },
        error: mockError
      }),
      signOut: async () => ({
        error: mockError
      }),
      onAuthStateChange: (callback: any) => {
        // Mock auth state change listener
        return {
          data: { subscription: { unsubscribe: () => {} } }
        }
      }
    } as any,
    
    storage: {
      from: (bucketName: string) => ({
        upload: async (path: string, file: any) => ({
          data: mockError ? null : { path, id: 'mock-file-id' },
          error: mockError
        }),
        download: async (path: string) => ({
          data: mockError ? null : new Blob(['mock file content']),
          error: mockError
        }),
        remove: async (paths: string[]) => ({
          data: mockError ? null : paths,
          error: mockError
        })
      })
    } as any,
    
    channel: (name: string) => ({
      on: (event: string, callback: any) => ({
        subscribe: () => {}
      })
    }) as any

  } as SupabaseClient
}

// Create a mock client with error responses
export const makeMockSupabaseClientWithError = (error: PostgresError): SupabaseClient => {
  return makeMockSupabaseClient({ mockError: error })
}

// Create a mock client with custom data
export const makeMockSupabaseClientWithData = (mockData: MockData): SupabaseClient => {
  return makeMockSupabaseClient({ mockData })
}

// Ready-to-use samples
export const sampleMockSupabaseClient = makeMockSupabaseClient()

export const sampleMockSupabaseClientWithData = makeMockSupabaseClientWithData({
  users: [
    { id: '1', email: 'user1@example.com', name: 'User 1' },
    { id: '2', email: 'user2@example.com', name: 'User 2' }
  ],
  posts: [
    { id: '1', title: 'Post 1', user_id: '1' },
    { id: '2', title: 'Post 2', user_id: '2' }
  ]
})

