import type { AIClient,  BrowserlessClient, ClientsContext, CrawlableDTO, CrawledDTO, DBQuery, DBQueryDTO, DBResponseDTO, EmbeddingModel, EmbeddingRequestDTO, EmbeddingResponseDTO, HexCoder, LLMModel, LLMRequestDTO, LLMResponseDTO, RequestDTO, TokenizableDTO, TokenizedDTO, Tokenizer, TokenizerExecutor } from "../../packages/types/index.ts"
import { createBrowserlessClient, createHexCoder, createOpenAIClient, createTextCoder, createTokenizer } from "./context.ts";
import { compileToDBQuery, executeDBQuery, translateRequestDTOToDBQueryDTO,formatToResponseDTO, parseRequest, compileToCrawlQuery, executeCrawlQuery, translateCrawledDTOToDBQueryDTO, formatToCrawlableDTO, formatToLLMRequestDTO, compileToLLMModel, executeLLMModel, translateLLMResponseDTOToDBQueryDTO, translateDBResponseDTOToDBQueryDTO, formatToTokenizableDTO, compileToTokenizerExecutor, executeTokenizerExecutor, translateTokenizedDTOToDBQueryDTO, formatToEmbeddingRequestDTO, executeEmbeddingModel, translateEmbeddingResponseDTOToDBQueryDTO, compileToEmbeddingModel } from "./pipeline-elements.ts"


export function createClientsContext(name:string):ClientsContext{
    switch (name){
    case 'fetch-links':
        return {browserlessClient:createBrowserlessClient(Deno.env),hexCoder:createHexCoder(createTextCoder())}
    case 'summarize-links':
        return {hexCoder:createHexCoder(createTextCoder()),aiClient:createOpenAIClient(Deno.env)}
    case 'chunk-fragments':
        const textCoder = createTextCoder();
        return {hexCoder:createHexCoder(textCoder),tokenizer:createTokenizer(textCoder.textDecoder,createHexCoder(textCoder),createHexCoder(textCoder))}
    case 'vectorize-chunks':
        return {hexCoder:createHexCoder(createTextCoder()),openaiClient:createOpenAIClient(Deno.env)
        }
    default:
        return {};
    }
}

export function getPipelineGenerator(name:string){
        switch (name){
        case 'select-table':
            return (client:unknown)=>{return [
                async(request:Request)=>await parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'select-tables'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                async (dbQuery:DBQuery<any,unknown>)=>await executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'select-row':
            return (client:unknown)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'select-rows'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'insert-links':
            return (client:unknown)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'insert-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'update-links':
            return (client:unknown)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'update-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]};
        case 'delete-links':
            return (client:unknown)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,'delete-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'fetch-links':
            return (client:unknown, browserlessClient:BrowserlessClient,hexCoder:HexCoder)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponse:DBResponseDTO<unknown>)=>formatToCrawlableDTO(dbResponse),
                (crawlableDTO:CrawlableDTO)=>compileToCrawlQuery(crawlableDTO, browserlessClient),
                (crawlQuery)=>executeCrawlQuery(crawlQuery),
                (crawledDTO:CrawledDTO)=>translateCrawledDTOToDBQueryDTO(hexCoder,crawledDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        case 'summarize-links':
            return (client:unknown,hexCoder:HexCoder, aiClient:AIClient)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-links'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToLLMRequestDTO(hexCoder,dbResponseDTO),
                (llmRequestDTO:LLMRequestDTO)=>compileToLLMModel(aiClient,llmRequestDTO),
                (llmModel:LLMModel)=>executeLLMModel(llmModel),
                (llmResponseDTO:LLMResponseDTO)=>translateLLMResponseDTOToDBQueryDTO(hexCoder,llmResponseDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
        case 'check-fragments':
            return (client:unknown)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-fragments'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbResponseDTO:DBResponseDTO<unknown>)=>translateDBResponseDTOToDBQueryDTO(dbResponseDTO,name,'insert-fragments'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
         case 'chunk-fragments':
            return (client:unknown,hexCoder:HexCoder, tokenizer:Tokenizer)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-fragments'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToTokenizableDTO(hexCoder,dbResponseDTO),
                (tokenizableDTO:TokenizableDTO)=>compileToTokenizerExecutor(tokenizer,tokenizableDTO),
                (tokenizerExecutor:TokenizerExecutor)=>executeTokenizerExecutor(tokenizerExecutor),
                (tokenizedDTO:TokenizedDTO)=>translateTokenizedDTOToDBQueryDTO(hexCoder,tokenizedDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO),
            ]}
        case 'vectorize-chunks':
            return (client:unknown,hexCoder:HexCoder, openaiClient:OpenAI)=>{return [
                (request:Request)=>parseRequest(request),
                (requestDTO:RequestDTO)=>translateRequestDTOToDBQueryDTO(requestDTO,name,'select-chunks'),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToEmbeddingRequestDTO(hexCoder,dbResponseDTO),
                (embeddingRequestDTO:EmbeddingRequestDTO)=>compileToEmbeddingModel(openaiClient,embeddingRequestDTO),
                (embeddingModel:EmbeddingModel)=>executeEmbeddingModel(embeddingModel),
                (embeddingResponseDTO:EmbeddingResponseDTO)=>translateEmbeddingResponseDTOToDBQueryDTO(hexCoder,embeddingResponseDTO),
                (dbQueryDTO:DBQueryDTO)=>compileToDBQuery(client,dbQueryDTO),
                (dbQuery:DBQuery<any,unknown>)=>executeDBQuery(dbQuery),
                (dbResponseDTO:DBResponseDTO<unknown>)=>formatToResponseDTO(dbResponseDTO)
            ]}
        default:
            throw new Error('Unknown pipeline name');
        }
    
}