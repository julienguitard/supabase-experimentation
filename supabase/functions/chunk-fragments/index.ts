import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createTextCoder, createHexCoder,createTokenEncoder, createTokenizer, createAuthenticatedSupabaseClient } from "../../utils/context.ts";
import { parseRequest,createResponse,formatToResponseDTO, executeDBQuery,compileToDBQuery,translateRequestDTOToDBQueryDTO, translateDBResponseDTOToDBQueryDTO, createResponseDTOFromAuthenticationError, formatToTokenizableDTO, compileToTokenizerExecutor, executeTokenizerExecutor, translateTokenizedDTOToDBQueryDTO } from "../../utils/pipeline.ts";


const textCoder = createTextCoder();
const hexCoder = createHexCoder(textCoder);
const tokenEncoder = createTokenEncoder("gpt-4o");
const tokenizer = createTokenizer(tokenEncoder,textCoder,hexCoder);
const edgeFunction: string = 'chunk-fragments';

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
    const dbQueryDTO = translateRequestDTOToDBQueryDTO(parsedRequest, edgeFunction, 'select-fragments');
    console.log(`[${Date.now()}] Step 02 complete: Database query DTO:`, dbQueryDTO);
    
  // Step 03: Compile the database query DTO to actual database query
    console.log(`[${Date.now()}] Step 03: Compiling database query...`);
    const dbQuery = compileToDBQuery(supabaseClient, dbQueryDTO);
    console.log(`[${Date.now()}] Step 03 complete: Compiled query:`, dbQuery);
    
  // Step 04: Execute the database query
    console.log(`[${Date.now()}] Step 04: Executing database query...`);
    const queryResult = await executeDBQuery(dbQuery);
    console.log(`[${Date.now()}] Step 04 complete: Query result:`, queryResult)


  // Step 05: Format the query result to tokenizable DTO
    console.log(`[${Date.now()}] Step 05: Formatting query result to tokenizable DTO...`);
    const tokenizableDTO = formatToTokenizableDTO(hexCoder,queryResult);
    console.log(`[${Date.now()}] Step 05 complete: Tokenizable DTO:`, tokenizableDTO);

  // Step 06: Compile the tokenizable DTO to tokenizer executor
    console.log(`[${Date.now()}] Step 06: Compiling tokenizable DTO to tokenizer executor...`);
    const tokenizerExecutor = compileToTokenizerExecutor(tokenizer,tokenizableDTO);
    console.log(`[${Date.now()}] Step 06 complete: Tokenizer executor:`, tokenizerExecutor);

  // Step 07: Execute the tokenizer executor
    console.log(`[${Date.now()}] Step 07: Executing tokenizer executor...`);
    const tokenizedDTO = executeTokenizerExecutor(tokenizerExecutor);
    console.log(`[${Date.now()}] Step 07 complete: Tokenized DTO:`, tokenizedDTO);

  // Step 08: Translate the tokenized DTO to database query DTO
    console.log(`[${Date.now()}] Step 08: Translating tokenized DTO to database query DTO...`);
    const dbQueryDTO2 = translateTokenizedDTOToDBQueryDTO(hexCoder,tokenizedDTO);
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
    console.log(`[${Date.now()}] Step 10: Formatting result to response DTO...`);
    const responseDTO = formatToResponseDTO(queryResult2);
    console.log(`[${Date.now()}] Step 11 complete: Response DTO:`, responseDTO);
    
  // Step 12: Create and return the final response
    console.log(`[${Date.now()}] Step 12: Creating final response...`);
    const finalResponse = createResponse(responseDTO);
    console.log(`[${Date.now()}] Step 11 complete: Final response created`);
    return finalResponse;
  }
  catch (error) {
    console.error(`[${Date.now()}] Error:`, error);
    return createResponse(createResponseDTOFromAuthenticationError(error));
  }
});