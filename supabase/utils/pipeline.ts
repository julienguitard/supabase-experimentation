import type { RequestDTO, DBQueryDTO, DBQuery, DBResponseDTO, ResponseDTO } from "@types";

export function parseRequest(req:Request):RequestDTO{
    const url = new URL(req.url);
    const method = req.method;
    const headers = req.headers;
    const body = req.body;

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
    return {method, urlSearchParams, authHeader};
}

export function translateToDBQueryDTO(req:RequestDTO):DBQueryDTO{
    const {method, urlSearchParams, authHeader} = req;
    const {table, id} = urlSearchParams;
    if (id) {
        return {table, id};
    }
    else {
        return {table};
    }
}

export function compileToDBQuery(client:Client,queryDTO:DBQueryDTO):DBQuery<Client,T>{
    const {table, id} = queryDTO;
    if (id) {
        // Thunk approach because of the way supabase works otherwise a SQL string would fit better
        return {client, query:()=>client.from(table).select('*').eq('id', id)};   
    }
    else {
        // Thunk approach because of the way supabase works otherwise a SQL string would fit better
        return {client, query:()=>client.from(table).select('*')};
    }
}

export async function executeDBQuery(DBquery:DBQuery<Client,T>):DBResponseDTO<T>{
    const {data, error} = await DBquery.query();
    return {data, error};
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