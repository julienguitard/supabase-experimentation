import type { DBQuery, DBResponseDTO } from '../../../packages/types/index.ts'
import { makeDBResponseDTO } from '../fixtures/dtos.ts'

export const makeMockDBQuery = <Client, T>(
  client: Client,
  mockData?: T[],
  overrides: Partial<DBQuery<Client, T>> = {}
): DBQuery<Client, T> => ({
  client,
  query: async (): Promise<DBResponseDTO<T>> => {
    return makeDBResponseDTO<T>({
      data: mockData || ([] as T[]),
      error: undefined
    })
  },
  ...overrides
})

export const sampleMockDBQuery = makeMockDBQuery<any, any>({}, [])

