import type { PostgresError } from "jsr:@supabase/supabase-js@2";
import type { Browser } from "npm:puppeteer-core";
import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';


// Utility generic types

export type Option<T> = T | null;

export type SingleOrArray<T> = T | T[];

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

export type ScrapableDTO = SingleOrArray<SingleScrapableDTO>;

export type SingleScrapedDTO = ResponseDTO

export type ScrapeQuery = {
    scrapableDTO: ScrapableDTO;
    browserlessClient?: BrowserlessClient; //Not allowed to use concurrently with browserless.io
    browser?: Browser;
}

export type ScrapedDTO = SingleOrArray<SingleScrapedDTO>;

export type SingleTokenizableDTOWithFragment = {
    fragment:string
}

export type SingleTokenizableDTOWithHexFragment = {
    hex_fragment:string
}

export type SingleTokenizableDTO = SingleTokenizableDTOWithFragment | SingleTokenizableDTOWithHexFragment;

export type TokenizableDTO = SingleOrArray<SingleTokenizableDTO>;

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

export type TokenizedDTO = SingleOrArray<SingleTokenizedDTO>;

export type Message<T> = {
    role: string;
    content: T;
}

export type SingleLLMRequestDTO = {
    model: string;
    maxToken: number;
    temperature?: number;
    messages: Message<string>[];
}

export type LLMRequestDTO = SingleOrArray<SingleLLMRequestDTO>;

export type SingleAIClient = OpenAI | Anthropic | DeepSeek;

export type AIClient = SingleOrArray<SingleAIClient>;

export type LLMModel<M extends Record<string,string>> = {
    llmRequestDTO:LLMRequestDTO;
    invoke: SingleOrArray<(singlellmRequestDTO:SingleLLMRequestDTO)=>Promise<string>>;
}

export type SingleLLMResponseDTO = {
    response: string;
    response_type?: string;
}

export type LLMResponseDTO = SingleOrArray<SingleLLMResponseDTO>;

export type SingleEmbeddingRequestDTO = {
    model: string;
    input: string;
};

export type EmbeddingRequestDTO = SingleOrArray<SingleEmbeddingRequestDTO>;

export type EmbeddingModel = {
    embeddingRequestDTO:EmbeddingRequestDTO;
    vectorize: SingleOrArray<(singleEmbeddingRequestDTO:SingleEmbeddingRequestDTO)=>Promise<number[]>>;
}

export type SingleEmbeddingResponseDTO = {
    embeddings: number[];
};

export type EmbeddingResponseDTO = SingleOrArray<SingleEmbeddingResponseDTO>;

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

export type LinkPayload = {link_id:string};

export type ContentPayload = {content_id:string};

export type MatchPayload = {match_id:string};

export type FragmentPayload = {fragment_id:string};

export type ModifiedQuestionPayload = {modified_question_id:string};

export type AnswerPayload = {answer_id:string};

export type ChunkPayload ={chunk_id:string};

