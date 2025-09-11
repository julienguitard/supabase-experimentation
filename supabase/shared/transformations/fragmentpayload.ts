import { Tokenizer, TokenizedDTO, SingleTokenizableDTOWithHexFragment, SingleTokenizableDTOWithFragment, SingleTokenizedDTOWithHexFragment, FragmentPayload } from "../../../packages/types/index.ts";

export function executeSingleTokenizableWithHexFragmentDTO(tokenizer:Tokenizer,tokenizableDTO:SingleTokenizableDTOWithHexFragment):TokenizedDTO{
    const {hex_fragment, ...payload} = tokenizableDTO;
    return tokenizer.chunkHexContent(hex_fragment,payload);
}


export function formatToFragmentPayload(tokenizedDTO:SingleTokenizedDTOWithHexFragment):FragmentPayload&{hex_chunk:string, start_:number, end_:number, length_:number}{
    const {hex_chunk, start_, end_, length_ ,...payload} = tokenizedDTO;
    if (('fragment_id' in payload) && (typeof payload.fragment_id === 'string')) {
        return {fragment_id: payload.fragment_id, hex_chunk, start_, end_, length_}
    }
    else {
        throw new Error('Payload is required');
    }
}
