import OpenAI from "openai";
import fs from "fs";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export interface GenerateOpenAiResponseRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  instructions?: string | null;
}

export interface GenerateOpenAiResponseWithRagRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  instructions?: string | null;
  openaiVectorStoreId?: string | null;
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
    this.model = opts?.model ?? "gpt-5-mini";
  }

  async generateResponse({ instructions, messages, openaiVectorStoreId }: GenerateOpenAiResponseWithRagRequest) {
    try {
      const input = [{ role: "system", content: instructions }, ...messages].filter(
        (item) => !!item.content,
      ) as OpenAI.Responses.ResponseInput;

      const response = await this.client.responses.create({
        model: this.model,
        input,
        ...(openaiVectorStoreId && {
          tools: [
            {
              type: "file_search",
              vector_store_ids: [openaiVectorStoreId],
            },
          ],
        }),
      });

      return response;
    } catch (error) {
      console.error("Failed to generate OpenAI response:", error);
      throw error;
    }
  }

  async createVectorStore(name?: string) {
    try {
      const vectorStore = await this.client.vectorStores.create({ name });

      const dbVectorStore = await prisma.openAIVectorStore.create({
        data: {
          openaiVectorStoreId: vectorStore.id,
          name: vectorStore.name,
        },
      });

      return { vectorStore, dbVectorStore };
    } catch (error) {
      console.error("Failed to create OpenAI vector store:", error);
      throw error;
    }
  }

  async uploadFile({
    path,
    vectorStoreId,
    filename,
    mimeType,
    checksum,
    metadata,
  }: {
    path: string;
    vectorStoreId: string;
    filename: string;
    mimeType?: string;
    checksum?: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      const file = await this.client.files.create({
        file: fs.createReadStream(path),
        purpose: "assistants",
      });

      const dbFile = await prisma.openAIFile.create({
        data: {
          vectorStoreId,
          openaiFileId: file.id,
          filename,
          mimeType,
          checksum,
          metadata: metadata as Prisma.InputJsonValue | undefined,
          sizeBytes: typeof file.bytes === "number" ? BigInt(file.bytes) : null,
          status: "uploaded",
        },
      });

      return { file, dbFile };
    } catch (error) {
      console.error("Failed to upload OpenAI file:", error);
      throw error;
    }
  }

  async attachFileToVectorStore({
    openaiVectorStoreId,
    openaiFileId,
    dbFileId,
  }: {
    openaiVectorStoreId: string;
    openaiFileId: string;
    dbFileId: string;
  }) {
    try {
      const result = await this.client.vectorStores.files.create(openaiVectorStoreId, {
        file_id: openaiFileId,
      });

      await prisma.openAIFile.update({
        where: { id: dbFileId },
        data: { status: "indexing" },
      });

      return result;
    } catch (error) {
      console.error("Failed to attach file to vector store:", error);
      throw error;
    }
  }

  async waitForFileIndexing({
    openaiVectorStoreId,
    openaiFileId,
    dbFileId,
  }: {
    openaiVectorStoreId: string;
    openaiFileId: string;
    dbFileId: string;
  }) {
    try {
      while (true) {
        const result = await this.client.vectorStores.files.retrieve(openaiVectorStoreId, openaiFileId);

        if (result.status === "completed") {
          await prisma.openAIFile.update({
            where: { id: dbFileId },
            data: { status: "ready" },
          });

          return result;
        }

        if (result.status === "failed") {
          await prisma.openAIFile.update({
            where: { id: dbFileId },
            data: { status: "failed" },
          });

          throw new Error("OpenAI file indexing failed");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error("Failed to wait for OpenAI indexing:", error);
      throw error;
    }
  }

  async uploadTextFile(text: string, filename: string): Promise<string> {
    const tmpPath = `/tmp/${filename}-${Date.now()}.txt`;
    fs.writeFileSync(tmpPath, text);
    try {
      const file = await this.client.files.create({
        file: fs.createReadStream(tmpPath),
        purpose: "assistants",
      });
      return file.id;
    } catch (error) {
      console.error("Failed to upload OpenAI text file:", error);
      throw error;
    } finally {
      fs.unlinkSync(tmpPath);
    }
  }

  async attachRawFileToVectorStore(openaiVectorStoreId: string, openaiFileId: string): Promise<void> {
    try {
      await this.client.vectorStores.files.create(openaiVectorStoreId, { file_id: openaiFileId });
      while (true) {
        const result = await this.client.vectorStores.files.retrieve(openaiVectorStoreId, openaiFileId);
        if (result.status === "completed") return;
        if (result.status === "failed") throw new Error("OpenAI file indexing failed");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error("Failed to attach raw file to vector store:", error);
      throw error;
    }
  }

  async deleteRawFile(openaiFileId: string): Promise<void> {
    try {
      await this.client.files.del(openaiFileId);
    } catch (error) {
      console.error("Failed to delete OpenAI file:", error);
      throw error;
    }
  }

  async deleteFile(dbFileId: string) {
    try {
      const dbFile = await prisma.openAIFile.findUniqueOrThrow({
        where: { id: dbFileId },
      });

      const result = await this.client.files.del(dbFile.openaiFileId);

      await prisma.openAIFile.update({
        where: { id: dbFileId },
        data: { status: "deleted" },
      });

      return result;
    } catch (error) {
      console.error("Failed to delete OpenAI file:", error);
      throw error;
    }
  }

  async createVectorStoreWithFile({
    name,
    path,
    filename,
    mimeType,
    checksum,
    metadata,
  }: {
    name?: string;
    path: string;
    filename: string;
    mimeType?: string;
    checksum?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { vectorStore, dbVectorStore } = await this.createVectorStore(name);

    const { file, dbFile } = await this.uploadFile({
      path,
      vectorStoreId: dbVectorStore.id,
      filename,
      mimeType,
      checksum,
      metadata,
    });

    await this.attachFileToVectorStore({
      openaiVectorStoreId: vectorStore.id,
      openaiFileId: file.id,
      dbFileId: dbFile.id,
    });

    await this.waitForFileIndexing({
      openaiVectorStoreId: vectorStore.id,
      openaiFileId: file.id,
      dbFileId: dbFile.id,
    });

    return { vectorStore, dbVectorStore, file, dbFile };
  }

  async createVectorStoreWithContent({
    storeName,
    content,
    filename,
  }: {
    storeName: string;
    content: string;
    filename: string;
  }): Promise<{ vectorStore: OpenAI.VectorStores.VectorStore; dbVectorStore: { id: string; openaiVectorStoreId: string; name: string | null } }> {
    const { vectorStore, dbVectorStore } = await this.createVectorStore(storeName);

    const tmpPath = `/tmp/${Date.now()}-${filename}`;
    fs.writeFileSync(tmpPath, content);
    try {
      const { file, dbFile } = await this.uploadFile({
        path: tmpPath,
        vectorStoreId: dbVectorStore.id,
        filename,
        mimeType: "text/plain",
      });
      await this.attachFileToVectorStore({
        openaiVectorStoreId: vectorStore.id,
        openaiFileId: file.id,
        dbFileId: dbFile.id,
      });
      await this.waitForFileIndexing({
        openaiVectorStoreId: vectorStore.id,
        openaiFileId: file.id,
        dbFileId: dbFile.id,
      });
    } finally {
      fs.unlinkSync(tmpPath);
    }

    return { vectorStore, dbVectorStore };
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
