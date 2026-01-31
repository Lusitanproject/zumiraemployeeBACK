import OpenAI from "openai";

export interface GenerateOpenAiResponseRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  instructions?: string | null;
}

export async function generateOpenAiResponse({ instructions, messages }: GenerateOpenAiResponseRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const input = [{ role: "system", content: instructions }, ...messages].filter(
    (item) => !!item.content
  ) as OpenAI.Responses.ResponseInput;

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input,
  });

  return response;
}
