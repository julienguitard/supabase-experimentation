import type { AIClient,  BrowserlessClient, ClientsContext, ScrapableDTO, ScrapedDTO, DBQuery, DBQueryDTO, DBResponseDTO, EmbeddingModel, EmbeddingRequestDTO, EmbeddingResponseDTO, HexCodec, LLMModel, LLMRequestDTO, LLMResponseDTO, RequestDTO, TextCodec, TokenizableDTO, TokenizedDTO, Tokenizer, TokenizerExecutor } from "../../packages/types/index.ts"
import { createBrowserlessClient, createHexCodec, createOpenAIClient, createTextCodec, createTokenizer, createTokenEncoder } from "./context-elements.ts";
import { compileToDBQuery, executeDBQuery, translateRequestDTOToDBQueryDTO,formatToResponseDTO, parseRequest, compileToScrapeQuery, executeScrapeQuery, translateScrapedDTOToDBQueryDTO, formatToScrapableDTO, formatToLLMRequestDTO, compileToLLMModel, executeLLMModel, translateLLMResponseDTOToDBQueryDTO, translateDBResponseDTOToDBQueryDTO, formatToTokenizableDTO, compileToTokenizerExecutor, executeTokenizerExecutor, translateTokenizedDTOToDBQueryDTO, formatToEmbeddingRequestDTO, executeEmbeddingModel, translateEmbeddingResponseDTOToDBQueryDTO, compileToEmbeddingModel } from "./pipeline-elements.ts"


export function getPipelineGenerator(name:string){
        switch (name){
        case 'select-table':
            return (client:unknown)=>{return [
                async(request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'select-tables'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'select-row':
            return (client:unknown)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'select-rows'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'insert-links':
            return (client:unknown)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'insert-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'update-links':
            return (client:unknown)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'update-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'delete-links':
            return (client:unknown)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'delete-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'fetch-links':
            return (client:unknown, browserlessClient:BrowserlessClient,hexCodec:HexCodec)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponse:DBResponseDTO<unknown>)=>formatToScrapableDTO(dbResponse),
                (scrapableDTO:ScrapableDTO)=>compileToScrapeQuery(scrapableDTO, browserlessClient),
                async (scrapeQuery)=>await executeScrapeQuery(scrapeQuery),
                (scrapedDTO:ScrapedDTO)=>translateScrapedDTOToDBQueryDTO(hexCodec,scrapedDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'summarize-links':
            return (client:unknown,hexCodec:HexCodec, aiClient:AIClient)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToLLMRequestDTO(hexCodec,dbResponseDTO,name,name),
                (llmRequestDTO:LLMRequestDTO)=>compileToLLMModel(llmRequestDTO,aiClient),
                async (llmModel:LLMModel)=>await executeLLMModel(llmModel),
                (llmResponseDTO:LLMResponseDTO)=>translateLLMResponseDTOToDBQueryDTO(llmResponseDTO,hexCodec,name,'insert-summaries'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}       
        case 'check-fragments':
            return (client:unknown)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,name),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
         case 'chunk-fragments':
            return (client:unknown,hexCodec:HexCodec, tokenizer:Tokenizer)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-fragments'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToTokenizableDTO(hexCodec,dbResponseDTO),
                (tokenizableDTO:TokenizableDTO)=>compileToTokenizerExecutor(tokenizer,tokenizableDTO),
                async (tokenizerExecutor:TokenizerExecutor)=>await executeTokenizerExecutor(tokenizerExecutor),
                (tokenizedDTO:TokenizedDTO)=>translateTokenizedDTOToDBQueryDTO(hexCodec,tokenizedDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
        case 'vectorize-chunks':
            return (client:unknown,hexCodec:HexCodec, openaiClient:OpenAI)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-chunks'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToEmbeddingRequestDTO(hexCodec,dbResponseDTO),
                (embeddingRequestDTO:EmbeddingRequestDTO)=>compileToEmbeddingModel(openaiClient,embeddingRequestDTO),
                async (embeddingModel:EmbeddingModel)=>await executeEmbeddingModel(embeddingModel),
                (embeddingResponseDTO:EmbeddingResponseDTO)=>translateEmbeddingResponseDTOToDBQueryDTO(hexCodec,embeddingResponseDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'insert-questions':
                return (client:unknown,hexCodec:HexCodec)=>{return [
                    async (request:Request)=>await parseRequest(request),
                    (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'insert-questions','insert-questions',hexCodec),//TO DO improve this
                    (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                    async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                    (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
                ]};
        case 'update-questions':
            return (client:unknown,hexCodec:HexCodec)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'update-questions','update-questions',hexCodec),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'delete-questions':
            return (client:unknown,hexCodec:HexCodec)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'delete-questions','delete-questions',hexCodec),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'answer-questions':
            return (client:unknown,hexCodec:HexCodec, aiClient:AIClient)=>{return [
                async (request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'match-question-with-chunks'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToLLMRequestDTO(hexCodec,dbResponseDTO,name,'modify-questions'),
                (llmRequestDTO:LLMRequestDTO)=>compileToLLMModel(llmRequestDTO,aiClient),
                async (llmModel:LLMModel)=>await executeLLMModel(llmModel),
                (llmResponseDTO:LLMResponseDTO)=>translateLLMResponseDTOToDBQueryDTO(llmResponseDTO,hexCodec,name,'insert-modified-questions'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToLLMRequestDTO(hexCodec,dbResponseDTO,name,'answer-questions'),
                (llmRequestDTO:LLMRequestDTO)=>compileToLLMModel(llmRequestDTO,aiClient),
                async (llmModel:LLMModel)=>await executeLLMModel(llmModel),
                (llmResponseDTO:LLMResponseDTO)=>translateLLMResponseDTOToDBQueryDTO(llmResponseDTO,hexCodec,name,'insert-answers'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(dbQueryDTO, client),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
        default:
            throw new Error('Unknown pipeline name');
        }
    
}