import type { PostgresError } from "jsr:@supabase/supabase-js@2";
import type { Browser } from "npm:puppeteer-core";
import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';

export type Option<T> = T | null;

export type OneOrMany<T> = T | T[];

export type Env = {
    get(key: string): Option<string>;
    // ...other methods like set, delete, toObjec;t, etc.
  }

export type BrowserlessClient = {
    url: string;
    headers: Record<string, string>;
    completeBody: (fetchableUrl:string)=>{url:string, elements: {selector:string}[]};
}

export type BrowserFactory = {
    browser: () => Promise<Browser>;
}

export type TextCoder = {
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
}

export type HexCoder = {
    encode: (input: string) => string;
    decode: (hexString: string) => string;
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
    url?: string;
    urlSearchParams: Record<string, string>;
    authHeader?: string;
    body?: ReturnType<Request["json"]>;
}

export type SingleCrawlableDTO = RequestDTO & {
    linkId: string;
}

export type CrawlableDTO = OneOrMany<SingleCrawlableDTO>;

export type SingleCrawledDTO = ResponseDTO & {
    linkId: string;
}

export type CrawlQuery = {
    crawlableDTO: CrawlableDTO;
    browserlessClient?: BrowserlessClient;
    browser?: Browser;
}

export type CrawledDTO = OneOrMany<SingleCrawledDTO>;

export type SingleLLMRequestDTO = {
    model: string;
    maxToken: number;
    temperature?: number;
    messages: Message<string>[];
    metadata?: Record<string, string>;
}

export type LLMRequestDTO = OneOrMany<SingleLLMRequestDTO>;

export type AIClient = OpenAI | Anthropic | DeepSeek;

export type LLMModel = {
    client: AIClient;
    LLMRequestDTO:LLMRequestDTO;
    invoke: (singleLLMRequestDTO:SingleLLMRequestDTO)=>Promise<string>;
}

export type SingleLLMResponseDTO = {
    response: string;
    response_type?: string;
    metadata?: Record<string, string>;
}

export type LLMResponseDTO = OneOrMany<SingleLLMResponseDTO>;

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
