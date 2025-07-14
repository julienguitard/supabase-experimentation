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
        const {data, error} = await client.from(cacheTable).insert(rows);
        if (error) {
            throw new Error('Error inserting into cache table');
        }
        else {
            const {data_,error_}=await client.rpc(sqlFunction, {});
            if (error_) {
                throw new Error('Error executing SQL function');
            }
            else {
                return {data:data_, error:error_};
            }
        }
    }
    catch (error) {
        throw new Error('Error executing insert in cache table query');
    }
}