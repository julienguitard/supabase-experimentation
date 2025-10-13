import {AssertEqual} from "@std/assert";
import { formatToChunkPayload } from "./chunkpayload.ts";
import { SingleEmbeddingResponseDTO } from "../../../packages/types/index.ts";
import { makeSingleEmbeddingResponseDTO } from "../../test-utils/index.ts";

Deno.test("formatToChunkPayload", () => {
    const singleEmbeddingResponseDTO:SingleEmbeddingResponseDTO = makeSingleEmbeddingResponseDTO({chunk_id: "1", embeddings: [1, 2, 3]});
    const chunkPayload = formatToChunkPayload(singleEmbeddingResponseDTO);
    AssertEqual(chunkPayload, {chunk_id: "1", embeddings: [1, 2, 3]});
});