import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import type {  OpenAI } from '@types';
import {createHexCoder, createAuthenticatedSupabaseClient, createOpenAIClient, createTextCoder } from "../../shared/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateRequestDTOToDBQueryDTO, translateLLMResponseDTOToDBQueryDTO, formatToLLMRequestDTO, compileToLLMModel, executeLLMModel, createResponseDTOFromAuthenticationError } from "../../shared/pipeline-elements.ts";


const openaiClient: OpenAI = createOpenAIClient();
const textCoder = createTextCoder();
const hexCoder = createHexCoder(textCoder);
const edgeFunction: string = 'summarize-links';

Deno.serve(async (req:Request)=>{
  try {
    const supabaseClient = createAuthenticatedSupabaseClient(Deno.env, req);
    const {data: {user}} = await supabaseClient.auth.getUser();
    console.log(`[${Date.now()}] user`, user);

  // Step 01: Parse the incoming request
    console.log(`[${Date.now()}] Step 01: Parsing incoming request...`);
    const parsedRequest = await parseRequest(req);
    console.log(`[${Date.now()}] Step 01 complete: Parsed request:`, parsedRequest);
    
  // Step 02: Translate the parsed request to database query DTO
    console.log(`[${Date.now()}] Step 02: Translating to database query DTO...`);
    const dbQueryDTO = translateRequestDTOToDBQueryDTO(parsedRequest, edgeFunction, 'select-contents');
    console.log(`[${Date.now()}] Step 02 complete: Database query DTO:`, dbQueryDTO);
    
  // Step 03: Compile the database query DTO to actual database query
    console.log(`[${Date.now()}] Step 03: Compiling database query...`);
    const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
    console.log(`[${Date.now()}] Step 03 complete: Compiled query:`, dbQuery);
    
  // Step 04: Execute the database query
    console.log(`[${Date.now()}] Step 04: Executing database query...`);
    const queryResult = await executeDBQuery(dbQuery);
    console.log(`[${Date.now()}] Step 04 complete: Query result:`, queryResult);

  // Step 05: Format the result to LLM request DTO
    console.log(`[${Date.now()}] Step 05: Formatting result to LLM request DTO...`);
    const llmRequestDTO = formatToLLMRequestDTO(hexCoder,queryResult);
    console.log(`[${Date.now()}] Step 05 complete: LLM request DTO:`, llmRequestDTO);

    //Step 06: Compile the LLM request DTO to LLM query
    console.log(`[${Date.now()}] Step 06: Compiling LLM model...`);
    const llmModel = compileToLLMModel(openaiClient,llmRequestDTO);
    console.log(`[${Date.now()}] Step 06 complete: LLM model:`, llmModel);

    //Step 07: Execute the LLM model
    console.log(`[${Date.now()}] Step 07: Executing LLM model...`);
    const llmResponseDTO = await executeLLMModel(llmModel);
    console.log(`[${Date.now()}] Step 07 complete: LLM response DTO:`, llmResponseDTO);


  // Step 08: Translate the LLM response DTO to database query DTO
    console.log(`[${Date.now()}] Step 08: Translating LLM response DTO to database query DTO...`);
    const dbQueryDTO2 = translateLLMResponseDTOToDBQueryDTO(hexCoder,llmResponseDTO);
    console.log(`[${Date.now()}] Step 08 complete: Database query DTO:`, dbQueryDTO2);

  // Step 09: Compile the database query DTO to actual database query
    console.log(`[${Date.now()}] Step 09: Compiling database query...`);
    const dbQuery2 = compileToDBQuery(supabaseClient, dbQueryDTO2);
    console.log(`[${Date.now()}] Step 09 complete: Compiled query:`, dbQuery2);

  // Step 10: Execute the database query
    console.log(`[${Date.now()}] Step 10: Executing database query...`);
    const queryResult2 = await executeDBQuery(dbQuery2);
    console.log(`[${Date.now()}] Step 10 complete: Query result:`, queryResult2);

  // Step 11: Format the result to response DTO
    console.log(`[${Date.now()}] Step 11: Formatting result to response DTO...`);
    const responseDTO = formatToResponseDTO(queryResult2);
    console.log(`[${Date.now()}] Step 11 complete: Response DTO:`, responseDTO);
    
  // Step 12: Create and return the final response
    console.log(`[${Date.now()}] Step 12: Creating final response...`);
    const finalResponse = createResponse(responseDTO);
    console.log(`[${Date.now()}] Step 12 complete: Final response created`);
    return finalResponse;
  }
  catch (error) {
    console.error(`[${Date.now()}] Error:`, error);
    return createResponse(createResponseDTOFromAuthenticationError(error));
  }
});