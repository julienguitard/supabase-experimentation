import type { SingleScrapableDTO, BrowserlessClient } from "../../../packages/types/index.ts";
import type { Option } from "../../../packages/types/index.ts";

export async function fetchSingleScrapable(single:SingleScrapableDTO, browserlessClient?:BrowserlessClient){
    const {method, url, headers, body,...payload} = single
    const init:RequestInit = browserlessClient ? {method, headers, body} : {method, headers}
    const response = await fetch(url!, init)
    const body_ = await response.text()
    const status = response.status
    const headers_ = response.headers
    const statusText = response.statusText
    const error:Option<string> = statusText ? statusText : null
    return {status, headers:headers_, body:body_, error,...payload}
}