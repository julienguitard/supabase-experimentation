import {AssertEqual} from "@std/assert";
import { SingleAIClient } from "../../../packages/types/index.ts";
import { cloneClient } from "./client-cloning.ts";

Deno.test("cloneClient", () => {
    const client:SingleAIClient = {name: "test", model: "test", apiKey: "test"};
    const clients = cloneClient(client, 3);
    AssertEqual(clients, [client, client, client]);
});