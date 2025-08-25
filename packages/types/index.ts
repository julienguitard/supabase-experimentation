import type { PostgresError } from "jsr:@supabase/supabase-js@2";
import type { Browser } from "npm:puppeteer-core";
import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';


// Utility types
export type Option<T> = T | null;

export type OneOrMany<T> = T | T[];

// Environment & clients types
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

export type Tokenizer = {
    encode: (input: string) => number[];
    decode: (tokens: number[]) => string;
    listSlice: (input: number[]) => {start:number,end:number}[];
    applyListSlice: (input: number[],slicesList: {start:number,end:number}[]) => {chunk_:number[],start_:number,end_:number}[];
    chunkContent: (input:string)=>{chunk:string,start_:number,end_:number}[];
    chunkHexContent: (input:string,x?:Record<string,any>)=>{x,chunk:string,start_:number,end_:number}[];
}


export type ClientsContext = {
    browserlessClient?: BrowserlessClient;
    hexCoder?: HexCoder;
    tokenizer?: Tokenizer;
    aiClient?: AIClient;
}

export type User = {
    email: string;
    user_id: string;
}

// Business and data types

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

export type SingleTokenizableDTOWithFragment = {
    fragment_id: string,
    fragment:string
}

export type SingleTokenizableDTOWithHexFragment = {
    fragment_id: string,
    hex_fragment:string
}

export type SingleTokenizableDTO = SingleTokenizableDTOWithFragment | SingleTokenizableDTOWithHexFragment;

export type TokenizableDTO = OneOrMany<SingleTokenizableDTO>;

export type TokenizerExecutor = {
    tokenizer: Tokenizer;
    tokenizableDTO: TokenizableDTO;
}

export type SingleTokenizedDTOWithFragment = {
    fragment_id: string,
    chunk:string,
    start_:number,
    end_:number
}

export type SingleTokenizedDTOWithHexFragment = {
    fragment_id: string;
    hex_chunk:string,
    start_:number,
    end_:number
}

export type SingleTokenizedDTO = SingleTokenizedDTOWithFragment | SingleTokenizedDTOWithHexFragment;

export type TokenizedDTO = OneOrMany<SingleTokenizedDTO>;

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

export type SingleEmbeddingRequestDTO = {
    model: string;
    input: string;
    chunkId: string;
};

export type EmbeddingRequestDTO = OneOrMany<SingleEmbeddingRequestDTO>;

export type EmbeddingModel = {
    client: AIClient;
    EmbeddingRequestDTO:EmbeddingRequestDTO;
    vectorize: (singleEmbeddingRequestDTO:SingleEmbeddingRequestDTO)=>Promise<number[]>;
}

export type SingleEmbeddingResponseDTO = {
    embeddings: number[];
    chunkId: string;
};

export type EmbeddingResponseDTO = OneOrMany<SingleEmbeddingResponseDTO>;

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
    error?: string;
}
