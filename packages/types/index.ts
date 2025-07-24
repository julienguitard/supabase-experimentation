import type { PostgresError } from "jsr:@supabase/supabase-js@2";

export type Option<T> = T | null;

export type OneOrMany<T> = T | T[];

export type Env = {
    get(key: string): Option<string>;
    // ...other methods like set, delete, toObject, etc.
  }

export type BrowserlessClient = {
    url: string;
    headers: Record<string, string>;
}

// Shared TypeScript types will go here 
export type User = {
    email: string;
}

export type Message<T> = {
    role: string;
    content: T;
}

export type RequestDTO = {
    method:string;
    urlSearchParams: Record<string, string>;
    authHeader?: string;
    body?: unknown;
}

export type SingleCrawlableDTO = {
    linkId: string;
    url: string;
    headers: Record<string, string>;
}

export type CrawlableDTO = OneOrMany<SingleCrawlableDTO>;


export type SingleBrowsingResponseDTO = {
    content: string;
    status: number;
    error: number;
}

export type SingleCrawledDTO = SingleBrowsingResponseDTO & {linkId:string};

export type CrawledDTO = OneOrMany<SingleCrawledDTO>;

export type ContentsRowDTO = {
    link_id: string;
    status: number;
    content: Uint8Array;
}

export type LLMRequestDTO = {
    model: string;
    maxToken: number;
    messages: Message<string>[];
}

export type LLMResponseDTO = {
    response: string;
    response_type: string;
};

export type EmbeddingRequestDTO = {
    model: string;
    input: string;
};

export type EmbeddingResponseDTO = {
    embedding: number[];
};

export type DBQueryDTO = {
  statement:string;
  table?: string;
  id?: string;
  cacheTable?: string;
  rows?: unknown[];
  SQLFunction?:string;
}

export type DBQuery<Client,T> = {
    client: Client;
    // Thunk approach because of the way supabase works otherwise a SQL string would fit better
    query:()=>Promise<DBResponseDTO<T>>;
}

export type DBResponseDTO<T> = {
    data?: T;
    error?: PostgresError;
}
export type ResponseDTO = {
    status: number;
    headers: Record<string, string>;
    body: string;
}
