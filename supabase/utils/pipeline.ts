import type {Option, RequestDTO, DBQueryDTO, DBQuery, DBResponseDTO, ResponseDTO, CrawlableDTO } from "@types";
import { edgeFunctionToStatement,  edgeFunctionToSQLFunction, edgeFunctionToCacheTable } from "./transformations/translate-to-dbquerydto-transformation.ts";
import { executeSelectQuery, executeInsertInCacheTableQuery } from "./transformations/compile-to-dbquery-transformation.ts";
import { executeSingeBrowsing } from "./transformations/execute-browsing.ts";
import type { Browser } from "https://deno.land/x/puppeteer@16.2.0/src/deno/Puppeteer.ts";

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
    return {method, urlSearchParams, authHeader, body};
}

export function translateToDBQueryDTO(reqDTO:RequestDTO, edgeFunction:string):DBQueryDTO{
    const {method, urlSearchParams, authHeader} = reqDTO;
    const statement = edgeFunctionToStatement(edgeFunction);
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
    else if  (rows && cacheTable &&SQLFunction) {
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
        console.log('data', data);
        console.log('error', error);
        return {data, error};
    }
    catch (error) {
        throw new Error('Error executing DB query');
    }
}

export function formatToCrawlableDTO(dbResponseDTO:DBResponseDTO<T>):CrawlableDTO[]{
    const {data, error} = dbResponseDTO;
    if (error) {
        throw new Error('Error formatting to crawlable DTO');
    }
    else {
        return data.map((d)=>({url:d.url, headers:null}))
    }
}

export async function executeBrowsing(browser:Browser,crawlableDTOs:CrawlableDTO[]):Promise<DBResponseDTO<T>>{
    try {
        const dbResponseDTOs = await Promise.all(crawlableDTOs.map(async (crawlableDTO)=>executeSingeBrowsing(browser,crawlableDTO.url)));
        const data = dbResponseDTOs.map((dbResponseDTO)=>dbResponseDTO.data);
        const error = dbResponseDTOs.map((dbResponseDTO)=>dbResponseDTO.error);
        return {data, error};
    }
    catch (executeBrowsingError) {
        throw new Error('Error executing browser query:',executeBrowsingError.message);
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

export function createResponse(res:ResponseDTO):Response{
    return new Response(JSON.stringify(res.body), {status: res.status, headers: res.headers});
}