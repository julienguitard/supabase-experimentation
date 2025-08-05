import type {  CrawlableDTO, CrawledDTO, LLMRequestDTO, LLMResponseDTO,   SingleCrawlableDTO, SingleCrawledDTO, SingleLLMRequestDTO, SingleLLMResponseDTO } from "./index.ts";


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
