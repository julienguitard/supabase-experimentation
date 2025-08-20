import type { OpenAI} from "npm:@types/openai";
import type {Anthropic} from 'npm:@anthropic-ai/sdk';
import type {DeepSeek} from 'npm:@deepseek-ai/sdk';

import type {  AIClient, CrawlableDTO, CrawledDTO, LLMRequestDTO, LLMResponseDTO,   SingleCrawlableDTO, SingleCrawledDTO, SingleLLMRequestDTO, SingleLLMResponseDTO, SingleTokenizableDTO, SingleTokenizableDTOWithFragment, SingleTokenizableDTOWithHexFragment, SingleTokenizedDTO, SingleTokenizedDTOWithHexFragment, SingleTokenizedDTOWithFragment,     TokenizableDTO, TokenizedDTO} from "./index.ts";

export function isSingleCrawlableDTO(crawlableDTO:CrawlableDTO):crawlableDTO is SingleCrawlableDTO{
    return 'url' in crawlableDTO;
}

export function isSingleCrawledDTO(crawledDTO:CrawledDTO): crawledDTO is SingleCrawledDTO{
    return 'linkId' in crawledDTO;
}

export function isSingleTokenizableDTO(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTO{
    return 'fragment_id' in tokenizableDTO;
}

export function isSingleTokenizableDTOWithHexFragment(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTOWithHexFragment{
    return (isSingleTokenizableDTO(tokenizableDTO)) && 'hex_fragment' in tokenizableDTO;
}

export function isSingleTokenizableDTOWithFragment(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTOWithFragment{
    return (isSingleTokenizableDTO(tokenizableDTO)) && 'fragment' in tokenizableDTO;
}

export function isListOfTokenizableDTO(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTO[]{
    const isEmpty = (!isSingleTokenizableDTO(tokenizableDTO)) && tokenizableDTO.length == 0
    const isNonEmpty =(!isSingleTokenizableDTO(tokenizableDTO)) && tokenizableDTO.length > 0 && isSingleTokenizableDTO(tokenizableDTO[0]);
    isEmpty || isNonEmpty;
}

export function isListOfTokenizableDTOWithHexFragment(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTOWithHexFragment[]{
    const isEmpty = (!isSingleTokenizableDTO(tokenizableDTO)) && tokenizableDTO.length == 0
    const isNonEmpty =(!isSingleTokenizableDTO(tokenizableDTO)) && tokenizableDTO.length > 0 && isSingleTokenizableDTOWithHexFragment(tokenizableDTO[0]);
    return isEmpty || isNonEmpty;
}

export function isListOfTokenizableDTOWithFragment(tokenizableDTO:TokenizableDTO):tokenizableDTO is SingleTokenizableDTOWithFragment[]{
    return (!isSingleTokenizableDTO(tokenizableDTO)) && tokenizableDTO.length > 0 && isSingleTokenizableDTOWithFragment(tokenizableDTO[0]);
}

export function isSingleTokenizedDTO(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTO{
    return 'fragment_id' in tokenizedDTO;
}

export function isSingleTokenizedDTOWithHexFragment(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTOWithHexFragment{
    return (isSingleTokenizedDTO(tokenizedDTO)) && 'hex_chunk' in tokenizedDTO;
}

export function isSingleTokenizedDTOWithFragment(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTOWithFragment{
    return (isSingleTokenizedDTO(tokenizedDTO)) && 'chunk' in tokenizedDTO;
}

export function isListOfTokenizedDTO(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTO[]{
    const isEmpty = (!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length == 0
    const isNonEmpty =(!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length > 0 && isSingleTokenizedDTO(tokenizedDTO[0]);
    return isEmpty || isNonEmpty;
}

export function isListOfTokenizedDTOWithHexFragment(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTOWithHexFragment[]{
    const isEmpty = (!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length == 0
    const isNonEmpty =(!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length > 0 && isSingleTokenizedDTOWithHexFragment(tokenizedDTO[0]);
    return isEmpty || isNonEmpty;
}

export function isListOfTokenizedDTOWithFragment(tokenizedDTO:TokenizedDTO):tokenizedDTO is SingleTokenizedDTOWithFragment[]{
    const isEmpty = (!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length == 0
    const isNonEmpty =(!isSingleTokenizedDTO(tokenizedDTO)) && tokenizedDTO.length > 0 && isSingleTokenizedDTOWithFragment(tokenizedDTO[0]);
    return isEmpty || isNonEmpty;
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