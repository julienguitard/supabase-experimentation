import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type { Option } from '@types';
import { generateClient,generateUser,getRequestParams, dbRequest, generateSuccessResponse, errorHandler, dbResponseHandler } from "../../utils/handlers.ts";


const supabaseClient = generateClient();

Deno.serve((req:Request)=>{
  const requestParams = getRequestParams(req);
  const url: URL = requestParams.url;
  const authHeader: Option<string> = requestParams.authHeader;
  const user: Option<{ email: string }>  = generateUser();
  const tableValue: Option<string>  = url.searchParams.get('table');
  const dbResponse:any = dbRequest(supabaseClient,tableValue,null); 

  return dbResponseHandler(user,dbResponse);
});
