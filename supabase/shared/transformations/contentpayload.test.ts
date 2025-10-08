import { AssertEqual } from "@std/assert";
import { SingleLLMResponseDTO } from "../../../packages/types/index.ts";
import { formatToContentPayload } from "./contentpayload.ts";

Deno.test("formatToContentPayload", () => {
    const singleLLMResponseDTO:SingleLLMResponseDTO = {content_id: "1", response: "test"};
    const contentPayload = formatToContentPayload(singleLLMResponseDTO, hexCodec);
    AssertEqual(contentPayload, {content_id: "1", hex_summary: "test"});
});