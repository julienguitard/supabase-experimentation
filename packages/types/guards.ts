import type { CrawlableDTO, CrawlableDTO22, CrawledDTO, SingleCrawlableDTO, SingleCrawledDTO } from "./index.ts";

export function isSingleCrawlableDTO(crawlableDTO:CrawlableDTO):crawlableDTO is SingleCrawlableDTO{
    return 'url' in crawlableDTO;
}

export function isSingleCrawlableDTO22(crawlableDTO:CrawlableDTO22):crawlableDTO is SingleCrawlableDTO22{
    return 'url' in crawlableDTO;
}


export function isSingleCrawledDTO(crawledDTO:CrawledDTO):crawledDTO is SingleCrawledDTO{
    return 'linkId' in crawledDTO;
}

export function isSingleCrawledDTO22(crawledDTO22:CrawledDTO22): crawledDTO22 is SingleCrawledDTO22{
    return 'linkId' in crawledDTO22;
}

