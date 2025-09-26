import { SingleEmbeddingRequestDTO, ChunkPayload, SingleEmbeddingResponseDTO, EmbeddingModel } from "../../../packages/types/index.ts";

/*export async function executeSingleEmbeddingRequestDTO(embeddingModel:EmbeddingModel,singleEmbeddingRequestDTO:SingleEmbeddingRequestDTO):Promise<SingleEmbeddingResponseDTO>{
    const {vectorize} = embeddingModel;
    const {model, input, ...payload} = singleEmbeddingRequestDTO;
    const response = await vectorize(embeddingRequestDTO);
    return {embeddings: response, ...payload};    
}*/


export function formatToChunkPayload(embeddingResponseDTO:SingleEmbeddingResponseDTO):ChunkPayload&{embeddings:number[]}{
    const {embeddings, ...payload} = embeddingResponseDTO;
    if (('chunk_id' in payload)&&(typeof payload.chunk_id === 'string')) {
        return {chunk_id: payload.chunk_id, embeddings: embeddings};
    }
    else {
        throw new Error('Payload is required');
    }
}