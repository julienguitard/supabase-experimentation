import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
//Create the token
function generateUser() {
  const email = Deno.env.get('TEST_EMAIL');
  const pwd = Deno.env.get('TEST_PWD');
  const user = {
    email: email
  };
  return user;
}
//const { token, tokenError } = supabase.auth.signInWithPassword({
//  email,
//  pwd
//});
// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
function generateSuccessResponse(user, tableData) {
  const responseData = {
    message: user ? `Hello ${user.email}, welcome back!` : 'Hello, anonymous user!',
    tableData: tableData ? tableData : {}
  };
  return createJsonResponse(responseData);
}
Deno.serve((req)=>{
  // Check for the Authorization header
  const authHeader = req.headers.get('Authorization');
  const user = generateUser();
  const url = new URL(req.url);
  const tableValue = url.searchParams.get('table');
  return supabaseClient.from(tableValue).select('*').then(({ data: links, error })=>{
    if (error) {
      console.error('Database error:', error);
      return createJsonResponse({
        error: 'Failed to fetch table rows:'
      }, 500);
    }
    return generateSuccessResponse(user, links);
  }).catch((err)=>{
    console.error('Server error:', err);
    return createJsonResponse({
      error: 'Internal server error'
    }, 500);
  });
});
