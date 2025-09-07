import type { AIClient,  BrowserlessClient, ClientsContext, ScrapableDTO, ScrapedDTO, DBQuery, DBQueryDTO, DBResponseDTO, EmbeddingModel, EmbeddingRequestDTO, EmbeddingResponseDTO, HexCodec, LLMModel, LLMRequestDTO, LLMResponseDTO, RequestDTO, TextCodec, TokenizableDTO, TokenizedDTO, Tokenizer, TokenizerExecutor } from "../../packages/types/index.ts"
import { createBrowserlessClient, createHexCodec, createOpenAIClient, createTextCodec, createTokenizer, createTokenEncoder } from "./context-elements.ts";
import { compileToDBQuery, executeDBQuery, translateRequestDTOToDBQueryDTO,formatToResponseDTO, parseRequest, compileToScrapeQuery, executeScrapeQuery, translateScrapedDTOToDBQueryDTO, formatToScrapableDTO, formatToLLMRequestDTO, compileToLLMModel, executeLLMModel, translateLLMResponseDTOToDBQueryDTO, formatToTokenizableDTO, compileToTokenizerExecutor, executeTokenizerExecutor, translateTokenizedDTOToDBQueryDTO, formatToEmbeddingRequestDTO, executeEmbeddingModel, translateEmbeddingResponseDTOToDBQueryDTO, compileToEmbeddingModel } from "./pipeline-elements.ts"

export function createClientsContext(name:string):ClientsContext{
    const textCodec = createTextCodec();
    const hexCodec = createHexCodec(textCodec);
    const openaiClient = createOpenAIClient();

    switch (name){
    case 'fetch-links':
        return {browserlessClient:createBrowserlessClient(),hexCodec:createHexCodec(createTextCodec())}
    case 'summarize-links':
        return {hexCodec:createHexCodec(createTextCodec()),aiClient:createOpenAIClient()}
    case 'chunk-fragments':
        const tokenizer = createTokenizer(createTokenEncoder(),textCodec,hexCodec);
        return {hexCodec,tokenizer}
    case 'vectorize-chunks':
        return {hexCodec,aiClient:createOpenAIClient()}
    case 'insert-questions':
        return {hexCodec:createHexCodec(createTextCodec())}
    case 'update-questions':
        return {hexCodec:createHexCodec(createTextCodec())}
     case 'delete-questions':
        return {hexCodec:createHexCodec(createTextCodec())}
    case 'answer-questions':
        return {hexCodec:createHexCodec(createTextCodec()),aiClient:createOpenAIClient()}
    default:
        return {};
    }
}
