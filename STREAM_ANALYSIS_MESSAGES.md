# Stream nos Analysis Message Controllers

## O que fazer

Adicionar SSE (Server-Sent Events) nos dois endpoints de análise consultiva. Todos os outros callers de `generateResponse` ficam inalterados.

## Arquivos a modificar

- `src/external/openai.ts` — overloads em `generateResponse`
- `src/controllers/act/AnalysisMessageController.ts` — trocar `res.json` por SSE
- `src/controllers/assessment/AnalysisMessageController.ts` — trocar `res.json` por SSE

---

## 1. `generateResponse` com overloads

```ts
async generateResponse(params: GenerateOpenAiResponseWithRagRequest & { stream: true }): Promise<Stream<OpenAI.Responses.ResponseStreamEvent>>;
async generateResponse(params: GenerateOpenAiResponseWithRagRequest & { stream?: false }): Promise<OpenAI.Response>;
async generateResponse({ instructions, messages, openaiVectorStoreId, stream }: GenerateOpenAiResponseWithRagRequest & { stream?: boolean }) {
  try {
    const input = [{ role: "system", content: instructions }, ...messages].filter(
      (item) => !!item.content,
    ) as OpenAI.Responses.ResponseInput;

    const base = {
      model: this.model,
      input,
      ...(openaiVectorStoreId && {
        tools: [{ type: "file_search", vector_store_ids: [openaiVectorStoreId] }],
      }),
    };

    if (stream) return this.client.responses.create({ ...base, stream: true });
    return this.client.responses.create(base);
  } catch (error) {
    console.error("Failed to generate OpenAI response:", error);
    throw error;
  }
}
```

## 2. Controllers — SSE

Substituir `res.json(...)` nos dois controllers:

```ts
const stream = await openAiApi.generateResponse({
  messages,
  instructions: ...,
  openaiVectorStoreId: ...,
  stream: true,
});

res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    res.write(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
  }
}

res.write("data: [DONE]\n\n");
res.end();
```

## Callers que NÃO mudam

- `ActService.ts:165` (compileChapter)
- `ActService.ts:329` (message)
- `ActService.ts:1027` (geração de relatório)

## Verificação

1. `npx tsc --noEmit` — zero erros de tipo
2. Testar com `curl -N` ou Postman (SSE mode) e verificar chunks `delta` chegando em tempo real
