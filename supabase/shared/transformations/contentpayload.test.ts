import { AssertEqual } from "@std/assert";
import { SingleLLMResponseDTO } from "../../../packages/types/index.ts";
import { formatToContentPayload } from "./contentpayload.ts";
import { makeSingleLLMResponseDTO } from "../../test-utils/index.ts";   

Deno.test("formatToContentPayload", () => {
    const singleLLMResponseDTO:SingleLLMResponseDTO = makeSingleLLMResponseDTO({});
    const contentPayload = formatToContentPayload(singleLLMResponseDTO, hexCodec);
    AssertEqual(contentPayload, {content_id: "1", hex_summary: "test"});
});