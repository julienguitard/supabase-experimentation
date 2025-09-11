import type { LLMResponseDTO, HexCodec, ContentPayload, SingleLLMResponseDTO } from "../../../packages/types/index.ts";


export function formatToContentPayload(llmResponseDTO:SingleLLMResponseDTO,hexCodec:HexCodec):ContentPayload&{hex_summary:string}{
    const {response, ...payload} = llmResponseDTO;
    if (('content_id' in payload) && (typeof payload.content_id === 'string')) {
        return {content_id: payload.content_id, hex_summary:hexCodec.encode(response)};
    }
    else {
        throw new Error('Payload is required');
    }
}