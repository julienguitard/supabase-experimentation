import type { ContentsRowDTO, Option, SingleScrapedDTO, HexCodec } from "@types";
import { createTextCodec, createHexCodec } from "../context-elements.ts";
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
            return 'links_to_scrape_extract';
        case 'summarize-links':
            return 'contents_to_summarize_extract';
        case 'check-fragments':
            return 'entities_to_fragment_extract';
        case 'chunk-fragments':
            return 'fragments_to_chunk_extract';
        case 'vectorize-chunks':
            return 'chunks_to_vectorize_extract';
        case 'answer-questions':
            return 'questions_to_answer_extract_with_chunks_extract';
        default:
            return null;
    }
}

export function edgeFunctionToCacheTable(edgeFunction:string,step?:string):Option<string>{
    switch (edgeFunction){
        case 'insert-links':
            return 'links_insert_buffer';
        case 'update-links':
            return 'links_update_buffer';
        case 'delete-links':
            return 'links_delete_buffer';
        case 'fetch-links':
            return 'contents_insert_buffer';
        case 'insert-contents':
            return 'contents_insert_buffer';
        case 'insert-summaries':
            return 'summaries_insert_buffer';
        case 'check-fragments':
            return 'fragments_insert_buffer';
        case 'chunk-fragments':
            return 'chunks_insert_buffer';
        case 'vectorize-chunks':
            return 'vectors_insert_buffer';
        case 'insert-questions':
            return 'questions_insert_buffer';
        case 'update-questions':
            return 'questions_update_buffer';
        case 'delete-questions':
            return 'questions_delete_buffer';
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
        case 'check-fragments-':
            return 'insert_into_fragments';
        case 'check-fragments':
            return 'insert_into_fragments_from_entities';
        case 'chunk-fragments':
            return 'insert_into_chunks';
        case 'vectorize-chunks':
            return 'insert_into_vectors';
        case 'insert-questions':
            return 'insert_into_questions';
        case 'update-questions':
            return 'update_into_questions';
        case 'delete-questions':
            return 'delete_into_questions';
        case 'answer-questions':
            switch(step){
                case 'match-question-with-chunks':
                    return 'insert_into_various_from_questions_to_answer_with_chunks_agg'
                default:
                    return null;
            }
        default:    
            return null;
    }
}

export function translateSingleScrapedDTOToContentsRowDTO(
  hexCodec: HexCodec,
  scrapedDTO: SingleScrapedDTO
): ContentsRowDTO {
  return {
    link_id: scrapedDTO,
    status: scrapedDTO.status,
    hex_content: hexCodec.encode(scrapedDTO.content),
  };
}


