import type { SingleLLMRequestDTO, AIClient } from "@types";
import { isAnthropicClient, isDeepSeekClient, isOpenAIClient } from "../../../packages/types/guards.ts";

export async function invoke(aiClient:AIClient,singleLLMReuquestDTO:SingleLLMRequestDTO):Promise<string>{
    if (isOpenAIClient(aiClient)) {
    const response_ = await aiClient.chat.completions.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
    return response_.choices[0]?.message?.content || "";
    }
    else if (isAnthropicClient(aiClient)) {
        const response_ = await aiClient.messages.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
        return response_.choices[0]?.message?.content || "";
    }
    else if (isDeepSeekClient(aiClient)) {
        const response_ = await aiClient.chat.completions.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
        return response_.choices[0]?.message?.content || "";
    }
}