import { makeDBResponseDataFromSelect, makeDBResponseDataFromSQLFunction } from '../fixtures/DBResponseData';
import type {  } from '../../../packages/types/index.ts';

export function makeMockSupabaseClient() {
  return {
    from: (table: string) => {
      const mockData = makeDBResponseDataFromSelect(table);
      return {mockData, 
        eq : (column_name: string, value: string) => {
          return mockData.filter((row: any) => row[column_name] === value);
        },
        select: (star='*') => {
          if (star === '*') {
            return mockData;
          }
          else {
            return[]
          }
        }
      }
    },
    rpc: (functionName: string) => {
      return makeDBResponseDataFromSQLFunction(functionName);
    }
  }
}