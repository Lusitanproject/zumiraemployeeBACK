import OpenAI from "openai";

export interface GenerateOpenAiResponseRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  instructions?: string | null;
}

export class OpenAiApi {
  private client: OpenAI;
  private apiKey: string;
  private model: string;

  constructor(opts?: { model?: string }) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("Environment variable OPENAI_API_KEY is not set");
    }

    this.apiKey = key;
    this.client = new OpenAI({ apiKey: this.apiKey });
    this.model = opts?.model ?? "gpt-4.1";
  }

  async generateResponse({ instructions, messages }: GenerateOpenAiResponseRequest) {
    try {
      const input = [{ role: "system", content: instructions }, ...messages].filter(
        (item) => !!item.content,
      ) as OpenAI.Responses.ResponseInput;

      const response = await this.client.responses.create({
        model: this.model,
        input,
      });

      return response;
    } catch (error) {
      console.error("Failed to generate OpenAI response:", error);
      throw error;
    }
  }
}
