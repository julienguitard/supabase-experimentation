import type {Option, RequestDTO, DBQueryDTO, DBQuery, DBResponseDTO, ResponseDTO, ScrapableDTO, SingleScrapableDTO, ScrapedDTO, ContentsRowDTO, TextCodec, HexCodec, Browser, BrowserFactory, ScrapeQuery, Client, BrowserlessClient, LLMRequestDTO,LLMModel, LLMResponseDTO, OpenAI, LinkPayload, ContentPayload, ChunkPayload, FragmentPayload} from "@types";
import { isListOfTokenizableDTOWithHexFragment, isSingleScrapableDTO, isSingleScrapedDTO, isSingleEmbeddingRequestDTO, isSingleEmbeddingResponseDTO, isSingleLLMRequestDTO, isSingleLLMResponseDTO, isSingleTokenizableDTOWithHexFragment, isSingleTokenizedDTOWithHexFragment, isSingleTokenizedDTOWithFragment, isSingleTokenizedDTO } from "../../packages/types/guards.ts";
import { edgeFunctionToStatement,  edgeFunctionToSQLFunction, edgeFunctionToCacheTable, translateSingleScrapedDTOToContentsRowDTO, edgeFunctionToTable } from "./transformations/dbquerydto-translation.ts";
import { executeSelectQuery, executeInsertInCacheTableQuery, executeFunction } from "./transformations/dbquery-execution.ts";
import { formatMessageForSummarizingContent, formatMessageForModifyingQuestions, formatMessageForAnsweringQuestions } from "./transformations/llmrequestdto-formatting.ts";
import { AIClient, EmbeddingRequestDTO, SingleLLMRequestDTO, TokenizableDTO, TokenizedDTO, Tokenizer, TokenizerExecutor, SingleEmbeddingRequestDTO, EmbeddingModel, EmbeddingResponseDTO, SingleTokenizedDTO, SingleTokenizableDTO, SingleTokenizableDTOWithHexFragment, ChunkPayload } from "../../packages/types/index.ts";
import { invoke, vectorize } from "./transformations/llmmodel-compilation.ts";
import { createTokenizer, createTextCodec, createTokenEncoder } from "./context-elements.ts";
import { translateSingleScrapableDTO,fetchSingleScrapable, formatToLinkPayload } from "./transformations/linkpayload.ts";
import { executeSingleTokenizableWithHexFragmentDTO, formatToFragmentPayload } from "./transformations/fragmentpayload.ts";
import { executeSingleEmbeddingRequestDTO, formatToChunkPayload } from "./transformations/chunkpayload.ts";
import { formatToContentPayload } from "./transformations/contentpayload.ts";
import { formatToModifiedQuestionPayload } from "./transformations/modifiedquestionpayload.ts";

export async function parseRequest(req:Request):RequestDTO{
    const url = new URL(req.url);
    const method = req.method;
    const headers = req.headers;
    let body = null;
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        body = await req.json();
    }
    else {
        body = null;
    }

    let table:Option<string> = null;
    let id:Option<string> = null;
    try {
        table = url.searchParams.get('table');
    }
    catch (error) {
        console.error(error);
    }
    try {
        id = url.searchParams.get('id');
    }
    catch (error) {
        console.error(error);
    }
    const urlSearchParams = {table, id};
    const authHeader = headers.get('Authorization');
    return {method, url:url.pathname, urlSearchParams, authHeader, body};
}

export function translateRequestDTOToDBQueryDTO(reqDTO:RequestDTO, edgeFunction:string, step?:string,hexCodec?:HexCodec):DBQueryDTO{
    const {method, urlSearchParams, authHeader} = reqDTO;
    let statement:string;
    if (step){
        statement = edgeFunctionToStatement(edgeFunction,step);
    }
    else {
        statement = edgeFunctionToStatement(edgeFunction);
    }
    if (statement === 'select'){
        if (urlSearchParams.table){
            if (urlSearchParams.id){
                return {statement, table: urlSearchParams.table, id: urlSearchParams.id};
            }
            else {
                return {statement, table: urlSearchParams.table};
            }
        }
        else {
            const table = edgeFunctionToTable(edgeFunction);
            if (urlSearchParams.id) {
                return {statement, table, id: urlSearchParams.id};
            }
            else {
                return {statement, table};
            }
        }
    }
    else {
        const {table, id} = urlSearchParams;
        let cacheTable:Option<string>;
        let SQLFunction:Option<string>;
        if (step){
            cacheTable = edgeFunctionToCacheTable(edgeFunction,step);
            SQLFunction = edgeFunctionToSQLFunction(edgeFunction,step);
        }
        else {
            cacheTable = edgeFunctionToCacheTable(edgeFunction);
            SQLFunction = edgeFunctionToSQLFunction(edgeFunction);
        }   
        const rows = reqDTO.body;
        if ((edgeFunction === 'insert-questions' || edgeFunction === 'update-questions') && hexCodec) {
            const rows_ = rows.map((row)=>({hex_question:hexCodec.encode(row.question)}));
            return {statement, table, rows: rows_, cacheTable, SQLFunction};
        } else if (edgeFunction === 'insert-questions' && !hexCodec) {
            throw new Error('HexCodec is required for insert-questions');
        }
        if (id) {
            throw new Error('Inserting with an id is not allowed');
        }
        else if (table) {
            return {statement,table, rows, cacheTable, SQLFunction};
        }
        else if (rows && cacheTable && SQLFunction) {
            return {statement, rows, cacheTable, SQLFunction};
        }
        else if ( SQLFunction) {
            return {statement, SQLFunction};
        }
        else {
            throw new Error('Wrong DBQueryDTO');
        }
    }
}


export function compileToDBQuery(DBqueryDTO:DBQueryDTO,client:Client):DBQuery<Client,T>{
    const {statement, table, id, cacheTable, rows,SQLFunction} = DBqueryDTO;
    if (id) {
        // Thunk approach because of the way supabase works otherwise a SQL string would fit better
        const tmp = {client, query:()=>executeSelectQuery(client, table, id)};
        return tmp;   
    }
    else if (table) {
        // Thunk approach because of the way supabase works otherwise a SQL string would fit better
        return {client, query:()=>executeSelectQuery(client, table)};
    }
    else if  (rows && cacheTable && SQLFunction) {
        // Thunk approach because of the way supabase works otherwise a SQL string would fit better
        console.log('Executing insert in cache table query',cacheTable, SQLFunction,rows);
        return {client, 
            query: ()=>executeInsertInCacheTableQuery(client, cacheTable, rows, SQLFunction)
        }
    }
    else if (SQLFunction) {
        return {client, query:()=>executeFunction(client, SQLFunction)};
    }
    else {
        throw new Error('Wrong DBQueryDTO');
    }
}

export async function executeDBQuery(dbQuery:DBQuery<Client,T>):DBResponseDTO<T>{
    try {
        console.log('Executing DB query',dbQuery.query);
        const {data, error} = await dbQuery.query();
        return {data, error};
    }
    catch (error) {
        throw new Error('Error executing DB query:' + error.message);
    }
}


export function formatToScrapableDTO(dbResponseDTO:DBResponseDTO<T>):ScrapableDTO&{link_id: string}{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to scrapable DTO');
    }
    else {
        return data.map((d)=>({method: 'GET', url:d.url, headers:{}, link_id: d.id,}))
    }
}




export function compileToScrapeQuery(scrapableDTO:ScrapableDTO, browserlessClient?:BrowserlessClient, browser?:Browser):ScrapeQuery{
    if (browserlessClient) {
        let scrapableDTO_:ScrapableDTO;
        let body:Option<string>;
        if (isSingleScrapableDTO(scrapableDTO)) {
             scrapableDTO_ = translateSingleScrapableDTO(scrapableDTO,browserlessClient);
        }
        else {
            scrapableDTO_ = scrapableDTO.map((c)=>translateSingleScrapableDTO(c,browserlessClient));
        }
        if (browser) {
            return {scrapableDTO: scrapableDTO_, browserlessClient, browser};//TODO: implement browser
        }
        else {
            return {scrapableDTO: scrapableDTO_, browserlessClient};
        }
    }
    else if (browser) {
        return {scrapableDTO, browser};//TODO: implement browser
    }
    else {
        return {scrapableDTO};
    }
}


export async function executeScrapeQuery(scrapeQuery:ScrapeQuery):Promise<ScrapedDTO>{
    const {scrapableDTO, browserlessClient, browser} = scrapeQuery;
    if (browser) {
        throw new Error('Browser not supported yet');//TODO: implement browser
    }
    else {
        if (isSingleScrapableDTO(scrapableDTO)) {
            return fetchSingleScrapable(scrapableDTO, browserlessClient)
        }
        else {
            const scrapedDTO: ScrapedDTO = [];
            for (const singleScrapableDTO of scrapableDTO) {
                const single = await fetchSingleScrapable(singleScrapableDTO, browserlessClient)
                scrapedDTO.push({
                    link_id: singleScrapableDTO.link_id,
                    status: single.status,
                    headers: single.headers,
                    body: single.body.slice(0,1000), // TO DO remove slice
                    error: single.error
                })
            }
            return scrapedDTO;
        }
    }
}

export function translateScrapedDTOToDBQueryDTO(hexCodec:HexCodec,scrapedDTO:ScrapedDTO):DBQueryDTO<LinkPayload>{
    if (isSingleScrapedDTO(scrapedDTO)) {
        const rows = formatToLinkPayload(scrapedDTO,hexCodec);
        return {statement: 'insert', cacheTable: 'contents_insert_buffer', rows, SQLFunction: 'insert_into_contents'};
    }
    else {
        const rows = scrapedDTO.map((scrapedDTO)=>formatToLinkPayload(scrapedDTO,hexCodec));
        return {statement: 'insert', cacheTable: 'contents_insert_buffer', rows, SQLFunction: 'insert_into_contents'};
    }
    
}

export function formatToTokenizableDTO(hexCodec:HexCodec,dbResponseDTO:DBResponseDTO<FragmentPayload>):TokenizableDTO{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to tokenizable DTO');
    }
    else {
        return data.map((d)=>({fragment_id: d.id, hex_fragment: d.hex_fragment}));
    }
}

export function compileToTokenizerExecutor(tokenizer:Tokenizer,tokenizableDTO:TokenizableDTO):TokenizerExecutor{
    return {tokenizer, tokenizableDTO};
}


export function executeTokenizerExecutor(tokenizerExecutor:TokenizerExecutor):Option<TokenizedDTO>{
    const {tokenizer, tokenizableDTO} = tokenizerExecutor;
    if (isSingleTokenizableDTOWithHexFragment(tokenizableDTO)) {
        return  executeSingleTokenizableWithHexFragmentDTO(tokenizer,tokenizableDTO);
    }
    else if (isListOfTokenizableDTOWithHexFragment(tokenizableDTO)) {
        return tokenizableDTO.flatMap((t)=>executeSingleTokenizableWithHexFragmentDTO(tokenizer,t));
    }
    else {
        return null;
    }
}

export function translateTokenizedDTOToDBQueryDTO(hexCodec:HexCodec,tokenizedDTO:TokenizedDTO):DBQueryDTO<FragmentPayload>{
    if (isSingleTokenizedDTO(tokenizedDTO)) {
        if (isSingleTokenizedDTOWithHexFragment(tokenizedDTO)) {
            try {
                const rows = formatToFragmentPayload(tokenizedDTO);
                return {statement: 'insert', cacheTable: 'chunks_insert_buffer', rows, SQLFunction: 'insert_into_chunks'};
            }
            catch (error) {
                console.error(error);  
            }
        }
        else if (isSingleTokenizedDTOWithFragment(tokenizedDTO)) {
            throw new Error('TokenizedDTO with fragment is not supported');
        }
    }
    else {
        try {
            const rows = tokenizedDTO.map((t)=>formatToFragmentPayload(t));
            return {statement: 'insert', cacheTable: 'chunks_insert_buffer', rows, SQLFunction: 'insert_into_chunks'};
        }
        catch (error) {
            console.error(error);
        }
    }
}


export function formatToLLMRequestDTO(hexCodec:HexCodec,dbResponseDTO:DBResponseDTO<T>, egdeFunction:string, step:string):Promise<LLMRequestDTO>{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to LLM request DTO');
    }
    else {
        switch(egdeFunction){
            case 'summarize-links': {
                console.log(data.map((d)=>({model: 'gpt-4o-mini', maxToken: 1000, temperature: 0.5, messages:  formatMessageForSummarizingContent(hexCodec,d.hex_content, d.category), content_id: d.id})));
                return data.map((d)=>({model: 'gpt-4o-mini', maxToken: 1000, temperature: 0.5, messages:  formatMessageForSummarizingContent(hexCodec,d.hex_content, d.category), content_id: d.id}));
            }
            case 'answer-questions': {
                switch(step){
                    case 'modify-questions': {
                        return data.map((d)=>({model: 'gpt-4o-mini', maxToken: 1000, temperature: 0.5, 
                            messages:  formatMessageForModifyingQuestions(hexCodec,d.hex_question, d.hex_chunks), match_id: d.match_id}));
                    }
                    case 'answer-questions':{
                        return data.map((d)=>({model: 'gpt-4o-mini', maxToken: 1000, temperature: 0.5, messages:  formatMessageForAnsweringQuestions(hexCodec,d.hex_modified_question, d.hex_chunks),modified_question_id: d.id}));
                    }
                    default: {
                        throw new Error('Wrong step');
                    }
                }
            }
            default: {
                throw new Error('Wrong edge function');
            }
        }
    }
}

export function compileToLLMModel(llmRequestDTO:LLMRequestDTO,aiClient:AIClient):LLMModel{
    return {client: aiClient, LLMRequestDTO:llmRequestDTO, invoke: (singlellmRequestDTO:SingleLLMRequestDTO)=>invoke(aiClient,singlellmRequestDTO)};
}

export async function executeLLMModel(llmModel:LLMModel):Promise<LLMResponseDTO>{
    const {LLMRequestDTO, invoke} = llmModel;
    if (isSingleLLMRequestDTO(LLMRequestDTO)) {
        const {model, maxToken, temperature, messages,...payload} = LLMRequestDTO
        const response = await invoke(LLMRequestDTO);
        return {response,...payload};
    }
    else {
        const llmResponseDTO:LLMResponseDTO = [];
        for (const llmRequestDTO of LLMRequestDTO) {
            const {model, maxToken, temperature, messages,...payload} = llmRequestDTO
            const response = await invoke(LLMRequestDTO)
            llmResponseDTO.push({response,...payload});
        }
        return llmResponseDTO;
    }
}

export function translateLLMResponseDTOToDBQueryDTO(llmResponseDTO:LLMResponseDTO,hexCodec:HexCodec,edgeFunction:string,step:string):DBQueryDTO<ContentPayload>{
    switch(edgeFunction){
        case 'summarize-links': {
            if (isSingleLLMResponseDTO(llmResponseDTO)) {
                try {
                    const rows = formatToContentPayload(llmResponseDTO,hexCodec);
                    return {statement: 'insert', cacheTable: 'summaries_insert_buffer', rows, SQLFunction: 'insert_into_summaries'};
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                try{
                    const rows = llmResponseDTO.map((llmResponseDTO)=>formatToContentPayload(llmResponseDTO,hexCodec));
                    return {statement: 'insert', cacheTable: 'summaries_insert_buffer', rows, SQLFunction: 'insert_into_summaries'};
                }
                catch (error) {
                    console.error(error);
                }             
            }           
        }
        case 'answer-questions':
            switch(step){
                case 'insert-modified-questions': {
                    if (isSingleLLMResponseDTO(llmResponseDTO)) {
                        try {
                            const rows = formatToModifiedQuestionPayload(llmResponseDTO,hexCodec);
                            return {statement: 'insert', cacheTable: 'modified_questions_insert_buffer', rows, SQLFunction: 'insert_into_modified_questions_with_chunks_agg'};
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }   
                    else {
                        try {
                            const rows = llmResponseDTO.map((llmResponseDTO)=>formatToModifiedQuestionPayload(llmResponseDTO,hexCodec));
                            return {statement: 'insert', cacheTable: 'modified_questions_insert_buffer', rows, SQLFunction: 'insert_into_modified_questions_with_chunks_agg'};
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                case 'insert-answers': {
                    if (isSingleLLMResponseDTO(llmResponseDTO)) {
                        try {
                            const rows = formatToModifiedQuestionPayload(llmResponseDTO,hexCodec);
                            return {statement: 'insert', cacheTable: 'modified_questions_insert_buffer', rows, SQLFunction: 'insert_into_modified_questions_with_chunks_agg'};
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    else {  
                        try {
                            const rows = llmResponseDTO.map((llmResponseDTO)=>formatToModifiedQuestionPayload(llmResponseDTO,hexCodec));
                            return {statement: 'insert', cacheTable: 'modified_questions_insert_buffer', rows, SQLFunction: 'insert_into_modified_questions_with_chunks_agg'};
                        }
                        catch (error) {
                            console.error(error);
                        }
                        return {statement: 'insert', cacheTable: 'answers_insert_buffer', rows, SQLFunction: 'insert_into_answers'};
                    }
                }
                default: {
                    throw new Error('Wrong step');
                }
            }
        default: {
            throw new Error('Wrong edge function');
        }
    }
}

export function formatToEmbeddingRequestDTO(hexCodec:HexCodec,dbResponseDTO:DBResponseDTO<ChunkPayload>):EmbeddingRequestDTO{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to embedding request DTO');
    }
    else {
        console.log('Formatting to embedding request DTO!',data);
        return data.map((d)=>({model: 'text-embedding-3-small', input: hexCodec.decode(d.chunk), chunk_id: d.id }));
    }
}   

export function compileToEmbeddingModel(aiClient:OpenAI,embeddingRequestDTO:EmbeddingRequestDTO):EmbeddingModel{
    return {client: aiClient, embeddingRequestDTO:embeddingRequestDTO, vectorize: (singleEmbeddingRequestDTO:SingleEmbeddingRequestDTO)=>vectorize(aiClient,singleEmbeddingRequestDTO)};
}

export async function executeEmbeddingModel(embeddingModel:EmbeddingModel):Promise<EmbeddingResponseDTO>{
    const {client, embeddingRequestDTO, vectorize} = embeddingModel;
    if (isSingleEmbeddingRequestDTO(embeddingRequestDTO)) {
        const singleEmbeddingResponseDTO = await executeSingleEmbeddingRequestDTO(embeddingModel,embeddingRequestDTO);
        return singleEmbeddingResponseDTO;
    }
    else {
        const embeddingResponseDTO:EmbeddingResponseDTO = [];
        for (const singleEmbeddingRequestDTO of embeddingRequestDTO) {
            const singleEmbeddingResponseDTO = await executeSingleEmbeddingRequestDTO(embeddingModel,singleEmbeddingRequestDTO);
            embeddingResponseDTO.push(singleEmbeddingResponseDTO);
        }
        return embeddingResponseDTO;
    }
}

export function translateEmbeddingResponseDTOToDBQueryDTO(hexCodec:HexCodec,embeddingResponseDTO:EmbeddingResponseDTO):DBQueryDTO <ChunkPayload>{
    if (isSingleEmbeddingResponseDTO(embeddingResponseDTO)) {
        const {embeddings, ...payload} = embeddingResponseDTO;
        if ('chunk_id' in payload) {
            const rows = formatToChunkPayload(embeddingResponseDTO);
            return {statement: 'insert', cacheTable: 'vectors_insert_buffer', rows, SQLFunction: 'insert_into_vectors'};
        }
        else {
            throw new Error('Payload is required');
        }
    }
    else {
        try {
            const rows = embeddingResponseDTO.map((embeddingResponseDTO)=>formatToChunkPayload(embeddingResponseDTO));
            return {statement: 'insert', cacheTable: 'vectors_insert_buffer', rows, SQLFunction: 'insert_into_vectors'};
        }
        catch (error) {
            console.error(error);
        }
    }
}

export function formatToResponseDTO(res:DBResponseDTO<T>):ResponseDTO{
    const {data, error} = res;
    if (error) {
        return {status: 500, headers: {'Content-Type': 'application/json'}, body: error.message};
    }
    else {
        return {status: 200, headers: {'Content-Type': 'application/json'}, body: data};
    }
}

export function createResponseDTOFromAuthenticationError(error:Error):ResponseDTO{
    return {status: 401, headers: {'Content-Type': 'application/json'}, body: error.message };
}

export function createResponse(res:ResponseDTO):Response{
    return new Response(JSON.stringify(res.body), {status: res.status, headers: res.headers});
}