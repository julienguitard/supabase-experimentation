import type { CrawlableDTO, CrawledDTO, SingleCrawlableDTO, SingleCrawledDTO } from "./index.ts";

export function isSingleCrawlableDTO(crawlableDTO:CrawlableDTO):crawlableDTO is SingleCrawlableDTO{
    return 'url' in crawlableDTO;
}

export function isSingleCrawledDTO(crawledDTO:CrawledDTO):crawledDTO is SingleCrawledDTO{
    return 'linkId' in crawledDTO;
}

