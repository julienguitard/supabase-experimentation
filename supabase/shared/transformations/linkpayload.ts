import type { SingleScrapableDTO, BrowserlessClient, ScrapedDTO, LinkPayload, HexCodec, SingleScrapedDTO } from "../../../packages/types/index.ts";
import type { Option } from "../../../packages/types/index.ts";
import { cleanRecursively } from "./meaningful-text-extractions.ts";


export function translateSingleScrapableDTO(scrapableDTO:SingleScrapableDTO,browserlessClient?:BrowserlessClient):SingleScrapableDTO{
    const {method, url, headers, body,...payload} = scrapableDTO;
    console.log("[translateSingleScrapableDTO] browserlessClient", browserlessClient.completeBody(url));
    return {method:'POST', url:browserlessClient.url, headers:browserlessClient.headers, body:JSON.stringify(browserlessClient.completeBody(url)),...payload};
}

export async function fetchSingleScrapable(single:SingleScrapableDTO, browserlessClient?:BrowserlessClient){
    const {method, url, headers, body,...payload} = single
    const init:RequestInit = browserlessClient ? {method, headers, body} : {method, headers}
    const response = await fetch(url!, init)
    //const body_ = await response.text()
    let body_:any;
    try{
        body_ =  await response.json()
    }
    catch(error){
        body_ = error.message
    }
    console.log("date.now()", Date.now(), " body_", body_)// TO DO remove
    /*const body__ = body_
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();*/
    const body__ = cleanRecursively(body_,['data','results','text','html','p','body','description'])
    const status = response.status
    const headers_ = response.headers
    const statusText = response.statusText
    const error:Option<string> = statusText ? statusText : null
    return {status, headers:headers_, body:body__, error,...payload}
}

export function formatToLinkPayload(scrapedDTO:SingleScrapedDTO,hexCodec:HexCodec):LinkPayload&{status:number,hex_content:string,hex_error:string}{
    const {status, headers, body, error, ...payload} = scrapedDTO;
    if (('link_id' in payload&&(typeof payload.link_id === 'string'))) {
        if (error) {
            return  {link_id: payload.link_id, status,hex_content:hexCodec.encode(body), hex_error:hexCodec.encode(error)}
        }
        else {
            return {link_id: payload.link_id, status,hex_content:hexCodec.encode(body),hex_error:null}
        }
    }
    else {
        throw new Error('Payload is required');
    }
}
