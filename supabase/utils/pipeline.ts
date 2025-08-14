import type {Option, RequestDTO, DBQueryDTO, DBQuery, DBResponseDTO, ResponseDTO, CrawlableDTO, CrawledDTO, ContentsRowDTO, TextCoder, HexCoder, Browser, BrowserFactory, CrawlQuery, Client, BrowserlessClient, LLMRequestDTO,LLMModel, LLMResponseDTO, OpenAI} from "@types";
import { isSingleCrawlableDTO, isSingleCrawledDTO, isSingleLLMRequestDTO, isSingleLLMResponseDTO } from "../../packages/types/guards.ts";
import { edgeFunctionToStatement,  edgeFunctionToSQLFunction, edgeFunctionToCacheTable, translateSingleCrawledDTOToContentsRowDTO } from "./transformations/dbquerydto-translation.ts";
import { executeSelectQuery, executeInsertInCacheTableQuery } from "./transformations/dbquery-execution.ts";
import { formatMessageForSummarizingContent } from "./transformations/llmrequestdto-formatting.ts";
import { AIClient, SingleLLMRequestDTO } from "../../packages/types/index.ts";
import { invoke } from "./transformations/llmmodel-compilation.ts";
import { createTokenizer } from "./context.ts";


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

export function translateToDBQueryDTO(reqDTO:RequestDTO, edgeFunction:string, step?:string):DBQueryDTO{
    const {method, urlSearchParams, authHeader} = reqDTO;
    let statement:string;
    if (step){
        statement = edgeFunctionToStatement(edgeFunction,step);
    }
    else {
        statement = edgeFunctionToStatement(edgeFunction);
    }
    switch (statement){
        case  'select' : {
            const {table, id} = urlSearchParams;
            if (id) {
                return {statement,table, id};
            }
            else if (table) {
                return {statement,table};
            }
            else {
                throw new Error('No table or id provided');
            }
        }
        case 'insert' : {
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
            if (id) {
                throw new Error('Inserting with an id is not allowed');
            }
            else if (table) {
                return {statement,table, rows, cacheTable, SQLFunction};
            }
            else {
                return {statement, rows, cacheTable, SQLFunction};
            }
        }
        case 'update' : {
            const {table, id} = urlSearchParams;
            const cacheTable = edgeFunctionToCacheTable(edgeFunction);
            const SQLFunction = edgeFunctionToSQLFunction(edgeFunction);
            const rows = reqDTO.body;
            if (id) {
                throw new Error('Inserting with an id is not allowed');
            }
            else if (table) {
                return {statement,table, rows, cacheTable, SQLFunction};
            }
            else {
                return {statement, rows, cacheTable, SQLFunction};
            }
        }
        case 'delete' : {
            const {table, id} = urlSearchParams;
            const cacheTable = edgeFunctionToCacheTable(edgeFunction);
            const SQLFunction = edgeFunctionToSQLFunction(edgeFunction);
            const rows = reqDTO.body;
            if (id) {
                throw new Error('Inserting with an id is not allowed');
            }
            else if (table) {
                return {statement,table, rows, cacheTable, SQLFunction};
            }
            else {
                return {statement, rows, cacheTable, SQLFunction};
            }
        }
        default: {
            const {table, id} = urlSearchParams;
            if (id) {
                return {statement,table, id};
            }
            else {
                return {statement,table};
            }
        }

    }
}

export function compileToDBQuery(client:Client,DBqueryDTO:DBQueryDTO):DBQuery<Client,T>{
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
        return {client, 
            query: ()=>executeInsertInCacheTableQuery(client, cacheTable, rows, SQLFunction)
        }
    }
    else {
        throw new Error('Wrong DBQueryDTO');
    }
}

export async function executeDBQuery(dbQuery:DBQuery<Client,T>):DBResponseDTO<T>{
    try {
        const {data, error} = await dbQuery.query();
        return {data, error};
    }
    catch (error) {
        throw new Error('Error executing DB query:' + error.message);
    }
}

export function formatToCrawlableDTO(dbResponseDTO:DBResponseDTO<T>):CrawlableDTO{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to crawlable DTO');
    }
    else {
        return data.map((d)=>({method: 'GET', url:d.url, headers:{}, linkId: d.id,}))
    }
}

export function compileToCrawlQuery(crawlableDTO:CrawlableDTO, browserlessClient?:BrowserlessClient, browser?:Browser):CrawlQuery{
    if (browserlessClient) {
        let crawlableDTO_:CrawlableDTO;
        let body:Option<string>;
        if (isSingleCrawlableDTO(crawlableDTO)) {
             crawlableDTO_ = {method: 'POST', url:browserlessClient.url,
                 headers:browserlessClient.headers, linkId: crawlableDTO.linkId,
                 body:browserlessClient.completeBody(crawlableDTO.url)};
        }
        else {
            crawlableDTO_ = crawlableDTO.map((c)=>({method: 'POST', url:browserlessClient.url, headers: browserlessClient.headers, linkId: c.linkId,body:browserlessClient.completeBody(c.url)}));
        }
        if (browser) {

            return {crawlableDTO: crawlableDTO_, browserlessClient, browser};//TODO: implement browser
        }
        
        else {
            return {crawlableDTO: crawlableDTO_, browserlessClient};
        }
    }
    else if (browser) {
        return {crawlableDTO, browser};//TODO: implement browser
    }
    else {
        return {crawlableDTO};
    }
}

export async function executeCrawlQuery(crawlQuery:CrawlQuery):Promise<CrawledDTO>{
    const {crawlableDTO, browserlessClient, browser} = crawlQuery;
    if (browser) {
        throw new Error('Browser not supported yet');//TODO: implement browser
    }
    else {
        if (isSingleCrawlableDTO(crawlableDTO)) {
            const {method, url, headers, linkId, body} = crawlableDTO;
            let response:Response;
            if (browserlessClient) {
                response = await fetch(url, {method, headers, body});
            }
            else {
                response = await fetch(url, {method, headers});
            }
            const body_ = await response.text();
            const status = response.status;
            const headers_ = response.headers;
            return {linkId, status, headers:headers_, body:body_};
        }
        else {
            const crawledDTO: CrawledDTO = [];
            for (const singleCrawlableDTO of crawlableDTO) {
                let response:Response;
                if (browserlessClient) {
                    response = await fetch(singleCrawlableDTO.url, {method: singleCrawlableDTO.method, headers: singleCrawlableDTO.headers, body: singleCrawlableDTO.body});
                }
                else {
                    response = await fetch(singleCrawlableDTO.url, {method: singleCrawlableDTO.method, headers: singleCrawlableDTO.headers});
                }
                const body_ = await response.text();
                const status = response.status;
                const headers_ = response.headers;
                let error:Option<string>;
                if (response.statusText) {
                    error = response.statusText;
                }
                else {
                    error = null;
                }
                crawledDTO.push({linkId: singleCrawlableDTO.linkId, status, headers:headers_, body:body_.slice(0,1000), error});//TO DO remove slice
            }
            return crawledDTO;
        }
    }
}

export function translateCrawledDTOToDBQueryDTO(hexCoder:HexCoder,crawledDTO:CrawledDTO):DBQueryDTO{
    if (isSingleCrawledDTO(crawledDTO)) {
        const {linkId, status, headers, body, error} = crawledDTO;
        if (error) {
            return {statement: 'insert', cacheTable: 'tmp_contents_insert', rows: [{link_id: linkId, status,hex_content:hexCoder.encode(body), hex_error:hexCoder.encode(error)}], SQLFunction: 'insert_into_contents'};
        }
        else {
            return {statement: 'insert', cacheTable: 'tmp_contents_insert', rows: [{link_id: linkId, status,hex_content:hexCoder.encode(body),hex_error:null}], SQLFunction: 'insert_into_contents'};
        }
    }
    else {
        const rows = crawledDTO.map((crawledDTO)=>({link_id: crawledDTO.linkId, status: crawledDTO.status, hex_content:hexCoder.encode(crawledDTO.body), hex_error:(crawledDTO.error)?hexCoder.encode(crawledDTO.error):null}));
        return {statement: 'insert', cacheTable: 'tmp_contents_insert', rows, SQLFunction: 'insert_into_contents'};
    }
    
}

export function formatToLLMRequestDTO(hexCoder:HexCoder,dbResponseDTO:DBResponseDTO<T>):Promise<LLMRequestDTO>{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to LLM request DTO');
    }
    else {
        return data.map((d)=>({model: 'gpt-4o-mini', maxToken: 1000, temperature: 0.5, messages:  formatMessageForSummarizingContent(hexCoder,d.hex_content, d.category), metadata:{contentId: d.id}}));
    }
}

export function compileToLLMModel(aiClient:AIClient,llmRequestDTO:LLMRequestDTO):LLMModel{
    return {client: aiClient, LLMRequestDTO:llmRequestDTO, invoke: (singlellmRequestDTO:SingleLLMRequestDTO)=>invoke(aiClient,singlellmRequestDTO)};
}

export async function executeLLMModel(llmModel:LLMModel):Promise<LLMResponseDTO>{
    const {LLMRequestDTO, invoke} = llmModel;
    if (isSingleLLMRequestDTO(LLMRequestDTO)) {
        const response = await invoke(LLMRequestDTO);
        return {response, metadata: LLMRequestDTO.metadata};
    }
    else {
        const llmResponseDTO:LLMResponseDTO = [];
        const tokenizer = createTokenizer();
        for (const llmRequestDTO of LLMRequestDTO) {
            const response = await invoke(llmRequestDTO);
            console.log("response", response);//TO DO remove
            console.log("tokens", tokenizer.encode(response));//TO DO remove
            llmResponseDTO.push({response, metadata: llmRequestDTO.metadata});
        }
        return llmResponseDTO;
    }
}

export function translateLLMResponseDTOToDBQueryDTO(hexCoder:HexCoder,llmResponseDTO:LLMResponseDTO):DBQueryDTO{
    if (isSingleLLMResponseDTO(llmResponseDTO)) {
        const {response, metadata} = llmResponseDTO;
        if (metadata) {
            return {statement: 'insert', cacheTable: 'tmp_summaries_insert', rows: [{content_id: metadata.contentId, hex_summary:hexCoder.encode(response.choices[0]?.message?.content || "")}], SQLFunction: 'insert_into_summaries', metadata};
        }
        else {
            throw new Error('Metadata is required');
        }
    }
    else {
        const rows = llmResponseDTO.map((llmResponseDTO)=>({content_id: llmResponseDTO.metadata.contentId,
             hex_summary:hexCoder.encode(llmResponseDTO.response)}));
        return {statement: 'insert', cacheTable: 'tmp_summaries_insert', rows, SQLFunction: 'insert_into_summaries'};
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