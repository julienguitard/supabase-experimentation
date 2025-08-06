import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';

import type {  AIClient, CrawlableDTO, CrawledDTO, LLMRequestDTO, LLMResponseDTO,   SingleCrawlableDTO, SingleCrawledDTO, SingleLLMRequestDTO, SingleLLMResponseDTO} from "./index.ts";

export function isSingleCrawlableDTO(crawlableDTO:CrawlableDTO):crawlableDTO is SingleCrawlableDTO{
    return 'url' in crawlableDTO;
}

export function isSingleCrawledDTO(crawledDTO:CrawledDTO): crawledDTO is SingleCrawledDTO{
    return 'linkId' in crawledDTO;
}

export function isSingleLLMRequestDTO(LLMRequestDTO:LLMRequestDTO):LLMRequestDTO is SingleLLMRequestDTO{
    return 'model' in LLMRequestDTO;
}

export function isSingleLLMResponseDTO(LLMResponseDTO:LLMResponseDTO):LLMResponseDTO is SingleLLMResponseDTO{
    return 'response' in LLMResponseDTO;
}

export function isOpenAIClient(client:AIClient):client is OpenAI{
    return 'chat' in client && typeof (client as any).chat?.completions?.create === 'function';
}

export function isAnthropicClient(client:AIClient):client is Anthropic{
    return 'messages' in client &&  typeof (client as any).messages?.create === 'function';
}

export function isDeepSeekClient(client:AIClient):client is DeepSeek{
    return 'chat' in client && 
    typeof (client as any).chat?.completions?.create === 'function' &&
    // Deepseek-specific check - assuming it has different baseURL or specific properties
    (
      (client as any).baseURL?.includes('deepseek') ||
      (client as any).baseURL?.includes('api.deepseek.com') ||
      // Or check for Deepseek-specific methods/properties
      'models' in client && typeof (client as any).models?.list === 'function'
    )
};