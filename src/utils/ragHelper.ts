import fs from "fs";

import { OpenAiApi } from "../external/openai";

export interface SyncDescriptorFileParams {
  openAiApi: OpenAiApi;
  currentOpenaiFileId: string | null;
  openaiFileSyncedAt: Date | null;
  updatedAt: Date;
  fileContent: string;
  filenamePrefix: string;
  checkInUse: () => Promise<number>;
  persistUpdate: (newFileId: string) => Promise<void>;
}

export async function syncDescriptorFile({
  openAiApi,
  currentOpenaiFileId,
  openaiFileSyncedAt,
  updatedAt,
  fileContent,
  filenamePrefix,
  checkInUse,
  persistUpdate,
}: SyncDescriptorFileParams): Promise<string | null> {
  const needsRecreation = !currentOpenaiFileId || (openaiFileSyncedAt && updatedAt > openaiFileSyncedAt);

  if (!needsRecreation) {
    console.log(`[RAG] descriptor file up-to-date, reusing ${currentOpenaiFileId} (prefix: ${filenamePrefix})`);
    return currentOpenaiFileId;
  }

  console.log(`[RAG] uploading new descriptor file (prefix: ${filenamePrefix})`);
  const newFileId = await openAiApi.uploadTextFile(fileContent, filenamePrefix);
  console.log(`[RAG] descriptor file uploaded: ${newFileId}`);

  if (currentOpenaiFileId && openaiFileSyncedAt) {
    const inUse = await checkInUse();
    if (inUse === 0) {
      console.log(`[RAG] old descriptor file ${currentOpenaiFileId} not in use, deleting`);
      await openAiApi.deleteRawFile(currentOpenaiFileId);
    } else {
      console.log(`[RAG] old descriptor file ${currentOpenaiFileId} still referenced by ${inUse} vector store(s), keeping`);
    }
  }

  await persistUpdate(newFileId);
  console.log(`[RAG] descriptor file persisted to DB`);
  return newFileId;
}

export interface CreateAnalysisVectorStoreParams {
  openAiApi: OpenAiApi;
  vectorStoreName: string;
  mainFileContent: string;
  mainFilename: string;
  descriptorOpenaiFileId: string | null;
}

export async function createAnalysisVectorStore({
  openAiApi,
  vectorStoreName,
  mainFileContent,
  mainFilename,
  descriptorOpenaiFileId,
}: CreateAnalysisVectorStoreParams) {
  console.log(`[RAG] creating vector store "${vectorStoreName}"`);
  const { vectorStore, dbVectorStore } = await openAiApi.createVectorStore(vectorStoreName);
  console.log(`[RAG] vector store created: openai=${vectorStore.id} db=${dbVectorStore.id}`);

  const tmpPath = `/tmp/${mainFilename}-${Date.now()}.txt`;
  fs.writeFileSync(tmpPath, mainFileContent);
  try {
    console.log(`[RAG] uploading main file "${mainFilename}"`);
    const { file, dbFile } = await openAiApi.uploadFile({
      path: tmpPath,
      vectorStoreId: dbVectorStore.id,
      filename: mainFilename,
      mimeType: "text/plain",
    });
    console.log(`[RAG] main file uploaded: openai=${file.id} db=${dbFile.id}`);

    console.log(`[RAG] attaching main file to vector store`);
    await openAiApi.attachFileToVectorStore({
      openaiVectorStoreId: vectorStore.id,
      openaiFileId: file.id,
      dbFileId: dbFile.id,
    });

    console.log(`[RAG] waiting for indexing of file ${file.id}`);
    await openAiApi.waitForFileIndexing({
      openaiVectorStoreId: vectorStore.id,
      openaiFileId: file.id,
      dbFileId: dbFile.id,
    });
    console.log(`[RAG] file ${file.id} indexed`);
  } finally {
    fs.unlinkSync(tmpPath);
  }

  if (descriptorOpenaiFileId) {
    console.log(`[RAG] attaching descriptor file ${descriptorOpenaiFileId} to vector store`);
    await openAiApi.attachRawFileToVectorStore(vectorStore.id, descriptorOpenaiFileId);
    console.log(`[RAG] descriptor file attached`);
  } else {
    console.log(`[RAG] no descriptor file to attach`);
  }

  return { vectorStore, dbVectorStore };
}
