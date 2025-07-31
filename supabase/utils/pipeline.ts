import type {Option, RequestDTO, DBQueryDTO, DBQuery, DBResponseDTO, ResponseDTO, CrawlableDTO, CrawledDTO, ContentsRowDTO, HexEncoder, Browser, BrowserFactory, CrawlableDTO, CrawledDTO,  CrawlQuery, Client, BrowserlessClient} from "@types";
import { isSingleCrawlableDTO, isSingleCrawledDTO } from "../../packages/types/guards.ts";
import { edgeFunctionToStatement,  edgeFunctionToSQLFunction, edgeFunctionToCacheTable, translateSingleCrawledDTOToContentsRowDTO } from "./transformations/translate-to-dbquerydto-transformation.ts";
import { executeSelectQuery, executeInsertInCacheTableQuery } from "./transformations/dbquery-execution.ts";



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
        throw new Error('Error executing DB query');
    }
}

/*export function formatToCrawlableDTO(dbResponseDTO:DBResponseDTO<T>):CrawlableDTO{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to crawlable DTO');
    }
    else {
        return data.map((d)=>({linkId: d.id, url:d.url, headers:{}}))
    }
}   */

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

            return {crawlableDTO: crawlableDTO_, browser, browserlessClient};//TODO: implement browser
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
                crawledDTO.push({linkId: singleCrawlableDTO.linkId, status, headers:headers_, body:body_.slice(0,1000)});//TO DO remove slice
            }
            return crawledDTO;
        }
    }
}

export function translateCrawledDTOToDBQueryDTO(hexEncoder,crawledDTO:CrawledDTO):DBQueryDTO{
    if (isSingleCrawledDTO(crawledDTO)) {
        const {linkId, status, headers, body} = crawledDTO;
        return {statement: 'insert', cacheTable: 'tmp_contents_insert', rows: [{link_id: linkId, status,hex_content:hexEncoder.encode(body)}], SQLFunction: 'insert_into_contents'};
    }
    else {
        const rows = crawledDTO.map((crawledDTO)=>({link_id: crawledDTO.linkId, status: crawledDTO.status, hex_content:hexEncoder.encode(crawledDTO.body)}));
        return {statement: 'insert', cacheTable: 'tmp_contents_insert', rows, SQLFunction: 'insert_into_contents'};
    }
    
}

/*export async function executeBrowsing(browserFactory:BrowserFactory,crawlableDTO:CrawlableDTO):Promise<CrawledDTO>{
    try {
        if (!isSingleCrawlableDTO(crawlableDTO)) {
            const crawledDTO: CrawledDTO = [];
            for (const singleCrawlableDTO of crawlableDTO) {
                console.log(`[${Date.now()}] executing single browsing for ${singleCrawlableDTO.url}`);
                const browser = await browserFactory.browser();
                const singleCrawledDTO = await executeSingleBrowsing(browser,singleCrawlableDTO);
                crawledDTO.push(singleCrawledDTO);
                await browser.close();
            }
            return crawledDTO;
        }
        else {
            const browser = await browserFactory.browser();
            const crawledDTO = await executeSingleBrowsing(browser,crawlableDTO);
            await browser.close();
            return crawledDTO;
        }
    }
    catch (executeBrowsingError) {
        throw new Error('Error executing browser query:',executeBrowsingError.message);
    }
}

export function translateCrawledDTOToRequestDTO(hexEncoder:HexEncoder,crawledDTO:CrawledDTO):RequestDTO{
    console.log(`[${Date.now()}] translateCrawledDTOToRequestDTO:`, crawledDTO);
    let rows:ContentsRowDTO[];
    if (!isSingleCrawledDTO(crawledDTO)) {
        rows = crawledDTO.map((crawledDTO)=>translateSingleCrawledDTOToContentsRowDTO(hexEncoder,crawledDTO))
        console.log(`[${Date.now()}] rows:`, rows);
    }
    else {
       console.log(`[${Date.now()}] crawledDTO:`, 'is single crawled DTO');
       rows = [translateSingleCrawledDTOToContentsRowDTO(hexEncoder,crawledDTO)]
       console.log(`[${Date.now()}] rows:`, rows);
    }
    console.log(`[${Date.now()}] translateCrawledDTOToRequestDTO:`, 'returning request DTO');
    return {method: 'POST', urlSearchParams: {}, authHeader: null, body: rows};
}*/

export function formatToResponseDTO(res:DBResponseDTO<T>):ResponseDTO{
    const {data, error} = res;
    if (error) {
        return {status: 500, headers: {'Content-Type': 'application/json'}, body: error.message};
    }
    else {
        return {status: 200, headers: {'Content-Type': 'application/json'}, body: data};
    }
}

export function createResponse(res:ResponseDTO):Response{
    return new Response(JSON.stringify(res.body), {status: res.status, headers: res.headers});
}