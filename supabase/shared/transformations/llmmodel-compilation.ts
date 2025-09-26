import type { SingleLLMRequestDTO, SingleAIClient, SingleEmbeddingRequestDTO, OpenAI } from "@types";
import { isAnthropicClient, isDeepSeekClient, isOpenAIClient } from "../../../packages/types/guards.ts";

export async function invokeSingleClient(aiClient:SingleAIClient,singleLLMRequestDTO:SingleLLMRequestDTO):Promise<string|undefined>{
    if (isOpenAIClient(aiClient)) {
        let response:string;
        try {
            console.log(`[${Date.now()}] Invoking OpenAI client`,singleLLMRequestDTO);
            const response_ = await aiClient.chat.completions.create({model: singleLLMRequestDTO.model, messages: singleLLMRequestDTO.messages, max_tokens: singleLLMRequestDTO.maxToken, temperature: singleLLMRequestDTO.temperature});
            response = response_.choices[0]?.message?.content || "";
        }
        catch (error) {
            response = error.message;
        }
        return response;
    }
    else if (isAnthropicClient(aiClient)) {
        let response:string;
        try {
            const response_ = await aiClient.messages.create({model: singleLLMRequestDTO.model, messages: singleLLMRequestDTO.messages, max_tokens: singleLLMRequestDTO.maxToken, temperature: singleLLMRequestDTO.temperature});
            response = response_.choices[0]?.message?.content || "";
        }
        catch (error) {
            response = error.message;
        }
        return response;
    }
    else if (isDeepSeekClient(aiClient)) {
        let response:string;
        try {
            const response_ = await aiClient.chat.completions.create({model: singleLLMRequestDTO.model, messages: singleLLMRequestDTO.messages, max_tokens: singleLLMRequestDTO.maxToken, temperature: singleLLMRequestDTO.temperature});
            response = response_.choices[0]?.message?.content || "";
        }
        catch (error) {
            response = error.message;
        }
        return response;
    }
}


export async function vectorizeWithSingleClient(aiClient:OpenAI,singleEmbeddingRequestDTO:SingleEmbeddingRequestDTO):Promise<number[]>{
    const response = await aiClient.embeddings.create({model: singleEmbeddingRequestDTO.model, input: singleEmbeddingRequestDTO.input});
        return response.data[0].embedding;
    }
