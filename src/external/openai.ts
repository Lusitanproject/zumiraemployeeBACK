import OpenAI from "openai";
import fs from "fs";

export interface GenerateOpenAiResponseRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  instructions?: string | null;
}

export interface CreateOpenAiBatchRequest {
  instructions?: string | null;
  batchItems: {
    customId: string;
    messages: {
      role: "user" | "assistant";
      content: string;
    }[];
  }[];
}

export interface CreateOpenAiBatchResponse {
  fileId: string;
  batchId: string;
  status: string;
  raw: OpenAI.Batches.Batch;
}

export interface RetrieveOpenAiBatchResultItem<T = unknown> {
  customId: string | null;
  data: T | null;
  raw: unknown;
}

export interface RetrieveOpenAiBatchResultResponse<T = unknown> {
  batchId: string;
  status: "completed" | "validating" | "failed" | "in_progress" | "finalizing" | "expired" | "cancelling" | "cancelled";
  results: RetrieveOpenAiBatchResultItem<T>[] | null;
  raw: OpenAI.Batches.Batch;
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
    this.model = opts?.model ?? "gpt-5.4";
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

  async createBatch({ instructions, batchItems }: CreateOpenAiBatchRequest): Promise<CreateOpenAiBatchResponse> {
    try {
      const jsonl = batchItems
        .map((item) => {
          const input = [{ role: "system", content: instructions }, ...item.messages].filter(
            (entry) => !!entry.content,
          );

          return JSON.stringify({
            custom_id: item.customId,
            method: "POST",
            url: "/v1/responses",
            body: {
              model: this.model,
              input,
            },
          });
        })
        .join("\n");

      const fileName = `/tmp/openai-batch-${Date.now()}.jsonl`;
      fs.writeFileSync(fileName, jsonl);

      const file = await this.client.files.create({
        file: fs.createReadStream(fileName),
        purpose: "batch",
      });

      const batch = await this.client.batches.create({
        input_file_id: file.id,
        endpoint: "/v1/responses",
        completion_window: "24h",
      });

      fs.unlinkSync(fileName);

      return {
        fileId: file.id,
        batchId: batch.id,
        status: batch.status,
        raw: batch,
      };
    } catch (error) {
      console.error("Failed to create OpenAI batch:", error);
      throw error;
    }
  }

  async retrieveBatchResult<T = unknown>(batchId: string): Promise<RetrieveOpenAiBatchResultResponse<T>> {
    try {
      const batch = await this.client.batches.retrieve(batchId);

      if (batch.status !== "completed") {
        return {
          batchId,
          status: batch.status,
          results: null,
          raw: batch,
        };
      }

      if (!batch.output_file_id) {
        return {
          batchId,
          status: batch.status,
          results: [],
          raw: batch,
        };
      }

      const file = await this.client.files.content(batch.output_file_id);
      const text = await file.text();

      const lines = text.trim().split("\n").filter(Boolean);

      const results: RetrieveOpenAiBatchResultItem<T>[] = lines.map((line) => {
        const item = JSON.parse(line) as {
          custom_id?: string | null;
          response?: {
            body?: {
              output?: {
                content?: {
                  text?: string;
                }[];
              }[];
            };
          };
        };

        const outputText = item.response?.body?.output?.[0].content?.[0]?.text;

        return {
          customId: item.custom_id ?? null,
          data: outputText ? (JSON.parse(outputText) as T) : null,
          raw: item,
        };
      });

      return {
        batchId,
        status: batch.status,
        results,
        raw: batch,
      };
    } catch (error) {
      console.error("Failed to retrieve OpenAI batch result:", error);
      throw error;
    }
  }
}
