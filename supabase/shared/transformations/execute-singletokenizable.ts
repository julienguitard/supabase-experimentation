import { Tokenizer, TokenizedDTO, SingleTokenizableDTOWithHexFragment, SingleTokenizableDTOWithFragment } from "../../../packages/types/index.ts";

export function executeSingleTokenizableWithHexFragmentDTO(tokenizer:Tokenizer,tokenizableDTO:SingleTokenizableDTOWithHexFragment):TokenizedDTO{
    const {hex_fragment, ...payload} = tokenizableDTO;
    return tokenizer.chunkHexContent(hex_fragment,payload);
}

