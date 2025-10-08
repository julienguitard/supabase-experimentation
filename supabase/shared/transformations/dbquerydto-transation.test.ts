import { AssertEqual } from "@std/assert";
import { SingleScrapedDTO } from "../../../packages/types/index.ts";
import { translateSingleScrapedDTOToContentsRowDTO } from "./dbquerydto-translation.ts";

Deno.test("translateSingleScrapedDTOToContentsRowDTO", () => {
    const singleScrapedDTO:SingleScrapedDTO = {id: "1", content: "test"};
    const contentsRowDTO = translateSingleScrapedDTOToContentsRowDTO(hexCodec, singleScrapedDTO);
    AssertEqual(contentsRowDTO, {id: "1", content: "test"});
});