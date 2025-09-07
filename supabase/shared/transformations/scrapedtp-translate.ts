import type { SingleScrapableDTO, BrowserlessClient } from "../../../packages/types/index.ts";

export function translateSingleScrapableDTO(scrapableDTO:SingleScrapableDTO,browserlessClient?:BrowserlessClient):SingleScrapableDTO{
    const {method, url, headers, body,...payload} = scrapableDTO;
    console.log("[translateSingleScrapableDTO] browserlessClient", browserlessClient.completeBody(url));
    return {method:'POST', url:browserlessClient.url, headers:browserlessClient.headers, body:JSON.stringify(browserlessClient.completeBody(url)),...payload};
}