import type { AIClient,  BrowserlessClient, ClientsContext, CrawlableDTO, CrawledDTO, DBQuery, DBQueryDTO, DBResponseDTO, EmbeddingModel, EmbeddingRequestDTO, EmbeddingResponseDTO, HexCoder, LLMModel, LLMRequestDTO, LLMResponseDTO, RequestDTO, TextCoder, TokenizableDTO, TokenizedDTO, Tokenizer, TokenizerExecutor } from "../../packages/types/index.ts"
import { createBrowserlessClient, createHexCoder, createOpenAIClient, createTextCoder, createTokenizer, createTokenEncoder } from "./context-elements.ts";
import { compileToDBQuery, executeDBQuery, translateRequestDTOToDBQueryDTO,formatToResponseDTO, parseRequest, compileToCrawlQuery, executeCrawlQuery, translateCrawledDTOToDBQueryDTO, formatToCrawlableDTO, formatToLLMRequestDTO, compileToLLMModel, executeLLMModel, translateLLMResponseDTOToDBQueryDTO, translateDBResponseDTOToDBQueryDTO, formatToTokenizableDTO, compileToTokenizerExecutor, executeTokenizerExecutor, translateTokenizedDTOToDBQueryDTO, formatToEmbeddingRequestDTO, executeEmbeddingModel, translateEmbeddingResponseDTOToDBQueryDTO, compileToEmbeddingModel } from "./pipeline-elements.ts"

export function createClientsContext(name:string):ClientsContext{
    const textCoder = createTextCoder();
    const hexCoder = createHexCoder(textCoder);
    const openaiClient = createOpenAIClient();

    switch (name){
    case 'fetch-links':
        return {browserlessClient:createBrowserlessClient(),hexCoder:createHexCoder(createTextCoder())}
    case 'summarize-links':
        return {hexCoder:createHexCoder(createTextCoder()),aiClient:createOpenAIClient()}
    case 'chunk-fragments':
        const tokenizer = createTokenizer(createTokenEncoder(),textCoder,hexCoder);
        return {hexCoder,tokenizer}
    case 'vectorize-chunks':
        return {hexCoder,aiClient:createOpenAIClient()}
    case 'insert-questions':
        return {hexCoder:createHexCoder(createTextCoder())}
    default:
        return {};
    }
}
