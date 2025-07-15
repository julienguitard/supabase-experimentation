import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type { Option } from '@types';
import { createSupabaseClient, createUser } from "../../utils/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateToDBQueryDTO } from "../../utils/pipeline.ts";


const supabaseClient: SupabaseClient = createSupabaseClient();
const edgeFunction: string = 'update-links';

Deno.serve(async (req:Request)=>{
  // Step 1: Parse the incoming request
  console.log(`[${Date.now()}] Step 1: Parsing incoming request...`);
  const parsedRequest = await parseRequest(req);
  console.log(`[${Date.now()}] Step 1 complete: Parsed request:`, parsedRequest);
  
  // Step 2: Translate the parsed request to database query DTO
  console.log(`[${Date.now()}] Step 2: Translating to database query DTO...`);
  const dbQueryDTO = translateToDBQueryDTO(parsedRequest, edgeFunction);
  console.log(`[${Date.now()}] Step 2 complete: Database query DTO:`, dbQueryDTO);
  
  // Step 3: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 3: Compiling database query...`);
  const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
  console.log(`[${Date.now()}] Step 3 complete: Compiled query:`, dbQuery);
  
  // Step 4: Execute the database query
  console.log(`[${Date.now()}] Step 4: Executing database query...`);
  const queryResult = await executeDBQuery(dbQuery);
  console.log(`[${Date.now()}] Step 4 complete: Query result:`, queryResult);
  
  // Step 5: Format the result to response DTO
  console.log(`[${Date.now()}] Step 5: Formatting result to response DTO...`);
  const responseDTO = formatToResponseDTO(queryResult);
  console.log(`[${Date.now()}] Step 5 complete: Response DTO:`, responseDTO);
  
  // Step 6: Create and return the final response
  console.log(`[${Date.now()}] Step 6: Creating final response...`);
  const finalResponse = createResponse(responseDTO);
  console.log(`[${Date.now()}] Step 6 complete: Final response created`);
  return finalResponse;
});