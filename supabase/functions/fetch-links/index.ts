import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type { Option, Browser, SupabaseClient } from '@types';
import { createBrowserFactory, createHexEncoder, createSupabaseClient, createUser } from "../../utils/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateToDBQueryDTO, formatToCrawlableDTO, executeBrowsing, translateCrawledDTOToDBQueryDTO, translateCrawledDTOToRequestDTO } from "../../utils/pipeline.ts";


const supabaseClient: SupabaseClient = createSupabaseClient();
const browserFactory: BrowserFactory = createBrowserFactory();
const textEncoder = new TextEncoder();
const hexEncoder = createHexEncoder(textEncoder);
const edgeFunction: string = 'fetch-links';

Deno.serve(async (req:Request)=>{

 // Step 01: Parse the incoming request
  console.log(`[${Date.now()}] Step 1: Parsing incoming request...`);
  const parsedRequest = await parseRequest(req);
  console.log(`[${Date.now()}] Step 1 complete: Parsed request:`, parsedRequest);
  
 // Step 02: Translate the parsed request to database query DTO
  console.log(`[${Date.now()}] Step 2: Translating to database query DTO...`);
  const dbQueryDTO = translateToDBQueryDTO(parsedRequest, edgeFunction, 'select-links');
  console.log(`[${Date.now()}] Step 2 complete: Database query DTO:`, dbQueryDTO);
  
 // Step 03: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 3: Compiling database query...`);
  const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
  console.log(`[${Date.now()}] Step 3 complete: Compiled query:`, dbQuery);
  
 // Step 04: Execute the database query
  console.log(`[${Date.now()}] Step 4: Executing database query...`);
  const queryResult = await executeDBQuery(dbQuery);
  console.log(`[${Date.now()}] Step 4 complete: Query result:`, queryResult);

 // Step 05: Format the result to crawlable DTO
  console.log(`[${Date.now()}] Step 5: Formatting result to crawlable DTO...`);
  const crawlableDTO = formatToCrawlableDTO(queryResult);
  console.log(`[${Date.now()}] Step 5 complete: Crawlable DTO:`, crawlableDTO);

 // Step 06: Execute the browsing
  console.log(`[${Date.now()}] Step 6: Executing browsing...`);
  const crawledDTO = await executeBrowsing(browserFactory,crawlableDTO);
  console.log(`[${Date.now()}] Step 6 complete: Crawled DTO:`, crawledDTO);

// Step 07: Translate the crawled DTO to request DTO
  console.log(`[${Date.now()}] Step 7: Translating crawled DTO to request DTO...`);
  const requestDTO2 = translateCrawledDTOToRequestDTO(hexEncoder,crawledDTO);
  console.log(`[${Date.now()}] Step 7 complete: Request DTO:`, requestDTO2);

// Step 08: Translate the request DTO to database query DTO
  console.log(`[${Date.now()}] Step 8: Translating request DTO to database query DTO...`);
  const dbQueryDTO2 = translateToDBQueryDTO(requestDTO2, edgeFunction, 'fetch-contents');
  console.log(`[${Date.now()}] Step 8 complete: Database query DTO:`, dbQueryDTO2);

// Step 09: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 8: Compiling database query...`);
  const dbQuery2 = compileToDBQuery(supabaseClient, dbQueryDTO2);
  console.log(`[${Date.now()}] Step 8 complete: Compiled query:`, dbQuery2);

// Step 10: Execute the database query
  console.log(`[${Date.now()}] Step 9: Executing database query...`);
  const queryResult2 = await executeDBQuery(dbQuery2);
  console.log(`[${Date.now()}] Step 9 complete: Query result:`, queryResult2);

// Step 11: Format the result to response DTO
  console.log(`[${Date.now()}] Step 5: Formatting result to response DTO...`);
  const responseDTO = formatToResponseDTO(queryResult2);
  console.log(`[${Date.now()}] Step 5 complete: Response DTO:`, responseDTO);
  
// Step 12: Create and return the final response
  console.log(`[${Date.now()}] Step 6: Creating final response...`);
  const finalResponse = createResponse(responseDTO);
  console.log(`[${Date.now()}] Step 6 complete: Final response created`);
  return finalResponse;
});