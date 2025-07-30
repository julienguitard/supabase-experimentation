import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type { Option } from '@types';
import { createSupabaseClient, createUser } from "../../utils/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateToDBQueryDTO } from "../../utils/pipeline.ts";


const supabaseClient: SupabaseClient = createSupabaseClient();
const edgeFunction: string = 'insert-links';

Deno.serve(async (req:Request)=>{
 // Step 01: Parse the incoming request
  console.log(`[${Date.now()}] Step 01: Parsing incoming request...`);
  const parsedRequest = await parseRequest(req);
  console.log(`[${Date.now()}] Step 01 complete: Parsed request:`, parsedRequest);
  
 // Step 02: Translate the parsed request to database query DTO
  console.log(`[${Date.now()}] Step 02: Translating to database query DTO...`);
  const dbQueryDTO = translateToDBQueryDTO(parsedRequest, edgeFunction);
  console.log(`[${Date.now()}] Step 02 complete: Database query DTO:`, dbQueryDTO);
  
 // Step 03: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 03: Compiling database query...`);
  const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
  console.log(`[${Date.now()}] Step 03 complete: Compiled query:`, dbQuery);
  
 // Step 04: Execute the database query
  console.log(`[${Date.now()}] Step 04: Executing database query...`);
  const queryResult = await executeDBQuery(dbQuery);
  console.log(`[${Date.now()}] Step 04 complete: Query result:`, queryResult);
  
 // Step 05: Format the result to response DTO
  console.log(`[${Date.now()}] Step 05: Formatting result to response DTO...`);
  const responseDTO = formatToResponseDTO(queryResult);
  console.log(`[${Date.now()}] Step 05 complete: Response DTO:`, responseDTO);
  
 // Step 06: Create and return the final response
  console.log(`[${Date.now()}] Step 06: Creating final response...`);
  const finalResponse = createResponse(responseDTO);
  console.log(`[${Date.now()}] Step 06 complete: Final response created`);
  return finalResponse;
});