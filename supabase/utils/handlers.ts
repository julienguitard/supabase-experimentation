import type { Option } from '@types';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

export function generateClient(ctx:Deno.Env=Deno.env):SupabaseClient{
  // Create a Supabase client
  const supabaseUrl: string = ctx.get('SUPABASE_URL') as string;
  const supabaseAnonKey: string = ctx.get('SUPABASE_ANON_KEY') as string;
  const supabaseClient: ReturnType<typeof createClient> = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient
}

//Create the user if needed
export function generateUser(ctx: Deno.Env = Deno.env): Option<{ email: string }> {
    try {
      const email = ctx.get('TEST_EMAIL');
      const pwd = ctx.get('TEST_PWD');
      const user = {
        email: email
      };
      return user;
    } catch (error) {
      console.error('Error generating user:', error);
      return null
    }
  }

export function getRequestParams(req:Request): {url:URL,authHeader:Option<string>}{
  const url: URL = new URL(req.url);
  const authHeader: Option<string> = req.headers.get('Authorization');
  return {url:url,authHeader:authHeader};
}

export function successHandler(data: unknown, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  export function dbRequest(ctx:SupabaseClient,tableValue:string,idValue:Option<string> = null):{data:any,error:any}{
    if (idValue) {
      return ctx.from(tableValue).select('*').eq('id',idValue)
    }
    else {
      return ctx.from(tableValue).select('*')
    }

  }

  export function generateSuccessResponse(user: { email: string }, tableData: unknown) {
    const responseData = {
      message: user ? `Hello ${user.email}, welcome back!` : 'Hello, anonymous user!',
      tableData: tableData ? tableData : {}
    };
    return successHandler(responseData);
  }
  export function errorHandler(message: string, err: unknown, status: number = 500): Response {
    console.error(message, err);
    return createJsonResponse({ error: message }, status);
  }

  export function dbResponseHandler(user:any,dbResponse:any):any {
    return dbResponse.then(({ data: links, error }: { data: unknown; error: unknown })=>{
      if (error) {
        return errorHandler('Failed to fetch table rows:', error, 500);
      }
      return generateSuccessResponse(user, links);
    }).catch((err)=>{
      return errorHandler('Internal server error', err, 500);
    });
  }