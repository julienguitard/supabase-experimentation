import type { PostgresError } from "jsr:@supabase/supabase-js@2";

export type Option<T> = T | null;
export type Env = {
    get(key: string): Option<string>;
    // ...other methods like set, delete, toObject, etc.
  }
// Shared TypeScript types will go here 
export type User = {
    email: string;
}

export type RequestDTO = {
    method:string;
    urlSearchParams: Record<string, string>;
    authHeader: Option<string>;
}

export type DBQueryDTO = {
  table: string;
  id: Option<string>;
}

export type DBQuery<Client,T> = {
    client: Client;
    // Thunk approach because of the way supabase works otherwise a SQL string would fit better
    query:()=>DBResponseDTO<T>;
}

export type DBResponseDTO<T> = {
    data: Option<T>;
    error: Option<PostgresError>;
}
export type ResponseDTO = {
    status: number;
    headers: Record<string, string>;
    body: string;
}
