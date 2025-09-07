import type { PostgresError } from "jsr:@supabase/supabase-js@2";
import type { Browser } from "npm:puppeteer-core";
import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';


// Utility generic types
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

export type TextCodec = {
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
}

export type HexCodec = {
    encode: (input: string) => string;
    decode: (hexString: string) => string;
}

export type Tokenizer = {
    encode: (input: string) => number[];
    decode: (tokens: number[]) => string;
    listSlice: (input: number[]) => {start:number,end:number}[];
    applyListSlice: (input: number[],slicesList: {start:number,end:number}[]) => {chunk_:number[],start_:number,end_:number,length_:number}[];
    chunkContent: (input:string)=>{chunk:string,start_:number,end_:number,length_:number}[];
    chunkHexContent: (input:string,x?:Record<string,any>)=>{x,chunk:string,start_:number,end_:number,length_:number}[];
}


export type ClientsContext = {
    browserlessClient?: BrowserlessClient;
    hexCodec?: HexCodec;
    tokenizer?: Tokenizer;
    aiClient?: AIClient;
}

export type User = {
    email: string;
    user_id: string;
}

// Business and data types


export type RequestDTO = {
    method:string;
    url?: string;
    urlSearchParams: Record<string, string>;
    authHeader?: string;
    body?: ReturnType<Request["json"]>;
}

export type SingleScrapableDTO = RequestDTO

export type ScrapableDTO = OneOrMany<SingleScrapableDTO>;

export type SingleScrapedDTO = ResponseDTO

export type ScrapeQuery = {
    scrapableDTO: ScrapableDTO;
    browserlessClient?: BrowserlessClient;
    browser?: Browser;
}

export type ScrapedDTO = OneOrMany<SingleScrapedDTO>;

export type SingleTokenizableDTOWithFragment = {
    fragment:string
}

export type SingleTokenizableDTOWithHexFragment = {
    hex_fragment:string
}

export type SingleTokenizableDTO = SingleTokenizableDTOWithFragment | SingleTokenizableDTOWithHexFragment;

export type TokenizableDTO = OneOrMany<SingleTokenizableDTO>;

export type TokenizerExecutor = {
    tokenizer: Tokenizer;
    tokenizableDTO: TokenizableDTO;
}

//Never used in practice because the tokenizer always returns a list
export type SingleTokenizedDTOWithFragment = {
    chunk:string,
    start_:number,
    end_:number,
    length_:number
}
//Never used in practice because the tokenizer always returns a list

export type SingleTokenizedDTOWithHexFragment = {
    hex_chunk:string,
    start_:number,
    end_:number,
    length_:number
}
//Never used in practice because the tokenizer always returns a list

export type SingleTokenizedDTO = SingleTokenizedDTOWithFragment | SingleTokenizedDTOWithHexFragment;

export type TokenizedDTO = OneOrMany<SingleTokenizedDTO>;

export type Message<T> = {
    role: string;
    content: T;
}

export type SingleLLMRequestDTO<M extends Record<string,string>> = {
    model: string;
    maxToken: number;
    temperature?: number;
    messages: Message<string>[];
    metadata?:M;
}

export type LLMRequestDTO<M extends Record<string,string>> = OneOrMany<SingleLLMRequestDTO<M>>;

export type AIClient = OpenAI | Anthropic | DeepSeek;

export type LLMModel<M extends Record<string,string>> = {
    client: AIClient;
    LLMRequestDTO:LLMRequestDTO<M>;
    invoke: (singleLLMRequestDTO:SingleLLMRequestDTO<M>)=>Promise<string>;
}

export type SingleLLMResponseDTO<M extends Record<string,string>> = {
    response: string;
    response_type?: string;
    metadata?: M;
}

export type LLMResponseDTO<M extends Record<string,string>> = OneOrMany<SingleLLMResponseDTO<M>>;

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
    data?: T[];
    error?: PostgresError;
}

export type ResponseDTO = {
    status: number;
    headers: Record<string, string>;
    body: string;
    error?: string;
}

//Utilities payload types

export type Link = {link_id:string}

export type Fragment = {fragment_id:string};

