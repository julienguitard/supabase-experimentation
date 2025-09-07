import { createMarkdownReader,createHexCodec } from "../context-elements.ts";
import type { Message, HexCodec } from "@types";
import { systemPrompt as systemPromptSummarizeLinks } from "../../prompts/summarize-links/system-0.ts";
import { userPrompt as userPromptSummarizeLinks } from "../../prompts/summarize-links/user-0.ts";
import { systemPrompt as systemPromptModifyQuestions } from "../../prompts/answer-questions/system-0.ts";
import { userPrompt as userPromptModifyQuestions } from "../../prompts/answer-questions/user-0.ts";
import { systemPrompt as systemPromptAnswerQuestions } from "../../prompts/answer-questions/system-1.ts";
import { userPrompt as userPromptAnswerQuestions } from "../../prompts/answer-questions/user-1.ts";

export function formatMessageForSummarizingContent(hexCodec:HexCodec,hexContent:string, category:string):Message<string>[]{
    const content = hexCodec.decode(hexContent);
    const systemPrompt_ = systemPromptSummarizeLinks.replace('{html}', content).replace('{category}', category);
    const userPrompt_ = userPromptSummarizeLinks.replace('{html}', content).replace('{category}', category);
    const messages = [{role: 'system', content: systemPrompt_}, {role: 'user', content: userPrompt_}];
    return messages;
}

export function formatMessageForModifyingQuestions(hexCodec:HexCodec,hexQuestion:string, hexChunks:string[]):Message<string>[]{

    const question = hexCodec.decode(hexQuestion);
    const chunks = hexChunks.map((hexChunk)=>hexCodec.decode(hexChunk)).join('\n');
    const systemPrompt_ = systemPromptModifyQuestions;  
    const userPrompt_ = userPromptModifyQuestions.replace('{question}', question).replace('{chunks}', chunks);
    const messages = [{role: 'system', content: systemPrompt_}, {role: 'user', content: userPrompt_}];  
    return messages;
}

export function formatMessageForAnsweringQuestions(hexCodec:HexCodec, hexModifiedQuestion:string, hexChunks:string[]):Message<string>[]{
    const modifiedQuestion = hexCodec.decode(hexModifiedQuestion);
    const chunks = hexChunks.map((hexChunk)=>hexCodec.decode(hexChunk)).join('\n');
    const systemPrompt_ = systemPromptAnswerQuestions;
    const answer_ = modifiedQuestion
    const userPrompt_1 = userPromptModifyQuestions.replace('{modified_question}', modifiedQuestion).replace('{chunks}', chunks);
    const messages = [{role: 'system', content: systemPrompt_}, {role:'assistant',content:answer_}, {role: 'user', content: userPrompt_1}];
    return messages;
}

