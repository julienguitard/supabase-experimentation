import type { Client } from "@supabase/supabase-js";
import type { DBResponseDTO } from "../../../packages/types";

export async function executeSelectQuery(client:Client, table:string, id?:string):Promise<DBResponseDTO<T>>{
    try {
        if (id) {
            const {data, error} = await client.from(table).select('*').eq('id', id);
            return {data, error};
        }
        else {
            const {data, error} = await client.from(table).select('*');
            return {data, error};
        }
    }
    catch (error) {
        throw new Error('Error executing select query');
    }
}

export async function executeInsertInCacheTableQuery(client:Client, cacheTable:string, rows:T, sqlFunction:string):Promise<DBResponseDTO<T>>{
    try {
        const {insertData, insertError} = await client.from(cacheTable).insert(rows);
        if (insertError) {
            throw new Error('Error inserting into cache table:',insertError.message);
        }
        else {
            console.log(`[${Date.now()}] sqlFunction:`,sqlFunction);
            try {
                const {rpcData, rpcError}=await client.rpc(sqlFunction);
                if (rpcError) {
                  throw new Error('Error in executing SQL function:',rpcError.message);
                }   
                else {
                    console.log(`[${Date.now()}] {data:rpcData, error:rpcError}:`,{data:rpcData, error:rpcError});
                    return {data:rpcData, error:rpcError};
                }
            }
            catch (rpcError) {
                throw new Error('Error executing SQL function:',rpcError.message);
            }
        }
    }
    catch (error) {
        throw new Error('Error executing insert in cache table query');
    }
}