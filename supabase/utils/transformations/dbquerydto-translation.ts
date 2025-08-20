import type { ContentsRowDTO, Option, SingleCrawledDTO, HexCoder } from "@types";
import { createTextCoder, createHexCoder } from "../context.ts";
import { Tokenizer } from "../../../packages/types/index.ts";

export function edgeFunctionToStatement(edgeFunction:string,step?:string):string{
    if (edgeFunction.includes('select')){
        return 'select';
    }
    else if (edgeFunction.includes('insert')){
        return 'insert';
    }
    else if (edgeFunction.includes('update')){
        return 'update';
    }
    else if (edgeFunction.includes('delete')){
        return 'delete';
    }
    else if (step && step.includes('select')){
        return 'select';
    }
    else {
        return 'insert'
    }
}

export function edgeFunctionToTable(edgeFunction:string,step?:string):Option<string>{
    switch (edgeFunction){
        case 'fetch-links':
            return 'tmp_links_to_crawl';
        case 'summarize-links':
            return 'tmp_contents_to_summarize';
        case 'check-fragments':
            return 'tmp_fragments_to_check';
        case 'chunk-fragments':
            return 'tmp_fragments_to_chunk_with_content';
        case 'vectorize-chunks':
            return 'tmp_chunks_to_vectorize';
        default:
            return null;
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
            return 'tmp_contents_insert';
        case 'insert-contents':
            return 'tmp_contents_insert';
        case 'insert-summaries':
            return 'tmp_summaries_insert';
        case 'check-fragments':
            return 'tmp_fragments_insert';
        case 'chunk-fragments':
            return 'tmp_chunks_insert';
        case 'vectorize-chunks':
            return 'tmp_vectors_insert';
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
            return 'insert_into_contents';
        case 'summarize-links':
            return 'insert_into_summaries';
        case 'check-fragments':
            return 'insert_into_fragments';
        case 'chunk-fragments':
            return 'insert_into_chunks';
        case 'vectorize-chunks':
            return 'insert_into_vectors';
        default:    
            return null;
    }
}

export function translateSingleCrawledDTOToContentsRowDTO(
  hexCoder: HexCoder,
  crawledDTO: SingleCrawledDTO
): ContentsRowDTO {
  return {
    link_id: crawledDTO.linkId,
    status: crawledDTO.status,
    hex_content: hexCoder.encode(crawledDTO.content),
  };
}

