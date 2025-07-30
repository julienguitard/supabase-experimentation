import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type { Option, Browser, SupabaseClient } from '@types';
import { createBrowserFactory, createHexEncoder, createSupabaseClient, createUser } from "../../utils/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateToDBQueryDTO, formatToCrawlableDTO, executeBrowsing, translateCrawledDTOToDBQueryDTO, formatToCrawlableDTO22, compileToCrawlQuery, executeCrawlQuery } from "../../utils/pipeline.ts";


const supabaseClient: SupabaseClient = createSupabaseClient();
const browserFactory: BrowserFactory = createBrowserFactory();
const textEncoder = new TextEncoder();
const hexEncoder = createHexEncoder(textEncoder);
const edgeFunction: string = 'fetch-links';

Deno.serve(async (req:Request)=>{

 // Step 01: Parse the incoming request
  console.log(`[${Date.now()}] Step 01: Parsing incoming request...`);
  const parsedRequest = await parseRequest(req);
  console.log(`[${Date.now()}] Step 01 complete: Parsed request:`, parsedRequest);
  
 // Step 02: Translate the parsed request to database query DTO
  console.log(`[${Date.now()}] Step 02: Translating to database query DTO...`);
  const dbQueryDTO = translateToDBQueryDTO(parsedRequest, edgeFunction, 'select-links');
  console.log(`[${Date.now()}] Step 02 complete: Database query DTO:`, dbQueryDTO);
  
 // Step 03: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 03: Compiling database query...`);
  const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
  console.log(`[${Date.now()}] Step 03 complete: Compiled query:`, dbQuery);
  
 // Step 04: Execute the database query
  console.log(`[${Date.now()}] Step 04: Executing database query...`);
  const queryResult = await executeDBQuery(dbQuery);
  console.log(`[${Date.now()}] Step 04 complete: Query result:`, queryResult);

 // Step 05: Format the result to crawlable DTO
  console.log(`[${Date.now()}] Step 05: Formatting result to crawlable DTO...`);
  const crawlableDTO22 = formatToCrawlableDTO22(queryResult);
  console.log(`[${Date.now()}] Step 05 complete: Crawlable DTO:`, crawlableDTO22);

  //Step 06: Compile the crawlable DTO to crawl query
  console.log(`[${Date.now()}] Step 06: Compiling crawl query...`);
  const crawlQuery = compileToCrawlQuery(crawlableDTO22);
  console.log(`[${Date.now()}] Step 06 complete: Crawl query:`, crawlQuery);

  //Step 07: Execute the crawal query
  console.log(`[${Date.now()}] Step 07: Executing crawl query...`);
  const crawledDTO22 = await executeCrawlQuery(crawlQuery);
  console.log(`[${Date.now()}] Step 07 complete: Crawled DTO:`, crawledDTO22);


// Step 08: Translate the crawled DTO to database query DTO
  console.log(`[${Date.now()}] Step 08: Translating crawled DTO to database query DTO...`);
  const dbQueryDTO2 = translateCrawledDTOToDBQueryDTO(hexEncoder,crawledDTO22);
  console.log(`[${Date.now()}] Step 08 complete: Database query DTO:`, dbQueryDTO2);

// Step 09: Compile the database query DTO to actual database query
  console.log(`[${Date.now()}] Step 08: Compiling database query...`);
  const dbQuery2 = compileToDBQuery(supabaseClient, dbQueryDTO2);
  console.log(`[${Date.now()}] Step 08 complete: Compiled query:`, dbQuery2);

// Step 10: Execute the database query
  console.log(`[${Date.now()}] Step 09: Executing database query...`);
  const queryResult2 = await executeDBQuery(dbQuery2);
  console.log(`[${Date.now()}] Step 09 complete: Query result:`, queryResult2);

// Step 11: Format the result to response DTO
  console.log(`[${Date.now()}] Step 05: Formatting result to response DTO...`);
  const responseDTO = formatToResponseDTO(queryResult2);
  console.log(`[${Date.now()}] Step 05 complete: Response DTO:`, responseDTO);
  
// Step 12: Create and return the final response
  console.log(`[${Date.now()}] Step 06: Creating final response...`);
  const finalResponse = createResponse(responseDTO);
  console.log(`[${Date.now()}] Step 06 complete: Final response created`);
  return finalResponse;
});