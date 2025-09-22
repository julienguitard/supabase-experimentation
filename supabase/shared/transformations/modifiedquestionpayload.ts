import type { HexCodec, ModifiedQuestionPayload, SingleLLMResponseDTO } from "../../../packages/types/index.ts";


export function formatToModifiedQuestionPayload(llmResponseDTO:SingleLLMResponseDTO,hexCodec:HexCodec):Array<ModifiedQuestionPayload&{hex_answer:string}>{
    const {response, ...payload} = llmResponseDTO;
    if (('modified_question_id' in payload) && (typeof payload.modified_question_id === 'string')) {
        return {modified_question_id: payload.modified_question_id, hex_answer:hexCodec.encode(response)};
    }
    else {
        throw new Error('Payload is required');
    }
}