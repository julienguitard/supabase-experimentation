import type { SingleLLMRequestDTO, OpenAI } from "@types";

export async function invoke(openAIClient:OpenAI,singleLLMReuquestDTO:SingleLLMRequestDTO):Promise<ChatCompletion>{
    const response_ = await openAIClient.chat.completions.create({model: singleLLMReuquestDTO.model, messages: singleLLMReuquestDTO.messages, max_tokens: singleLLMReuquestDTO.maxToken, temperature: singleLLMReuquestDTO.temperature});
    return response_.choices[0]?.message?.content || "";
}