import { createMarkdownReader,createHexCoder } from "../context.ts";
import type { Message, HexCoder } from "@types";
import { systemPrompt } from "../../prompts/summarize-links/system-0.ts";
import { userPrompt } from "../../prompts/summarize-links/user-0.ts";

export function formatMessageForSummarizingContent(hexCoder:HexCoder,hexContent:string, category:string):Message<string>[]{
    const content = hexCoder.decode(hexContent);
    const systemPrompt_ = systemPrompt.replace('{html}', content).replace('{category}', category);
    const userPrompt_ = userPrompt.replace('{html}', content).replace('{category}', category);
    const messages = [{role: 'system', content: systemPrompt_}, {role: 'user', content: userPrompt_}];
    return messages;
}