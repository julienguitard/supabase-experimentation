import type { HexCodec, MatchPayload, SingleLLMResponseDTO } from "../../../packages/types/index.ts";

export function formatToMatchPayload(llmResponseDTO:SingleLLMResponseDTO,hexCodec:HexCodec):MatchPayload&{hex_modified_question:string}{
    const {response, ...payload} = llmResponseDTO;
    if (('match_id' in payload) && (typeof payload.match_id === 'string')) {
        return {match_id: payload.match_id, hex_modified_question:hexCodec.encode(response)};
    }
    else {
        throw new Error('Payload is required');
    }
}

