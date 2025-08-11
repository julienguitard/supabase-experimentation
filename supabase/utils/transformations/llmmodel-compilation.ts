import type { SingleLLMRequestDTO, AIClient } from "@types";
import { isAnthropicClient, isDeepSeekClient, isOpenAIClient } from "../../../packages/types/guards.ts";

export async function invoke(aiClient:AIClient,singleLLMReuquestDTO:SingleLLMRequestDTO):Promise<string>{
    if (isOpenAIClient(aiClient)) {
        let response:string;
        try {
            const response_ = await aiClient.chat.completions.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
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
            const response_ = await aiClient.messages.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
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
            const response_ = await aiClient.chat.completions.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
            response = response_.choices[0]?.message?.content || "";
        }
        catch (error) {
            response = error.message;
        }
        return response;
    }
}