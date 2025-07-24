import type { ContentsRowDTO, Option, SingleCrawledDTO } from "@types";
import { createTextEncoder } from "../context.ts";

export function edgeFunctionToStatement(edgeFunction:string,step?:string):string{
    if (edgeFunction.includes('insert')){
        return 'insert';
    }
    else if (edgeFunction.includes('update')){
        return 'update';
    }
    else if (edgeFunction.includes('delete')){
        return 'delete';
    }
    else if (edgeFunction.includes('fetch')){
        if (step === 'select-links'){
            return 'select';
        }
        else if (step === 'fetch-contents'){
            return 'insert';
        }
        else {
            return 'select';
        }
    }
    else {
        return 'select';
    }
}

export function edgeFunctionToCacheTable(edgeFunction:string,step?:string):Option<string>{
    switch (edgeFunction){
        case 'insert-links':
            return 'tmp_links_insert';
        case 'update-links':
            return 'tmp_links_update';
        case 'delete-links':
            return 'tmp_links_delete';
        case 'fetch-links':
            if (step === 'fetch-contents'){
                return 'tmp_contents_insert';
            }
            else {
                return 'tmp_contents_insert';
            }
        case 'insert-contents':
            return 'tmp_contents_insert';
        case 'insert-summaries':
            return 'tmp_summaries_insert';
        default:
            return null;
    }
}

export function edgeFunctionToSQLFunction(edgeFunction:string,step?:string):Option<string>{
    switch (edgeFunction){
        case 'insert-links':
            return 'insert_into_links';
        case 'update-links':
            return 'update_into_links';
        case 'delete-links':
            return 'delete_into_links';
        case 'fetch-links':
            if (step === 'fetch-contents'){
                return 'insert_into_contents';
            }
            else {
                return 'insert_into_contents';
            }
        case 'insert-contents':
            return 'tmp_contents_insert';
        case 'insert-summaries':
            return 'tmp_summaries_insert';
        default:    
            return null;
    }
}

export function translateSingleCrawledDTOToContentsRowDTO(
  textEncoder: TextEncoder,
  crawledDTO: SingleCrawledDTO
): ContentsRowDTO {
  return {
    link_id: crawledDTO.linkId,
    status: crawledDTO.status,
    content: textEncoder.encode(crawledDTO.content),
  };
}
