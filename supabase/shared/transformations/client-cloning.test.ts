import {AssertEqual} from "@std/assert";
import { SingleAIClient } from "../../../packages/types/index.ts";
import { cloneClient } from "./client-cloning.ts";
import { makeSingleAIClient } from "../../test-utils/index.ts";

Deno.test("cloneClient", () => {
    const client:SingleAIClient = makeSingleAIClient({});
    const clients = cloneClient(client, 3);
    AssertEqual(clients, [client, client, client]);
});