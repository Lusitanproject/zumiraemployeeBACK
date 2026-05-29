# Contrato SSE — Analysis Message Endpoints

Os dois endpoints de análise consultiva passaram a responder via **Server-Sent Events** em vez de JSON único.

---

## Endpoints

| Domínio    | Método | Path                                          |
| ---------- | ------ | --------------------------------------------- |
| Act        | POST   | `/acts/:actChatbotId/analysis/message`        |
| Assessment | POST   | `/assessments/:assessmentId/analysis/message` |

Ambos têm o mesmo contrato de request e response.

---

## Request

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**

```json
{
  "messages": [
    { "role": "user", "content": "Qual o prazo do contrato?" },
    { "role": "assistant", "content": "O prazo é de 12 meses." },
    { "role": "user", "content": "E a multa rescisória?" }
  ]
}
```

| Campo                | Tipo                      | Obrigatório |
| -------------------- | ------------------------- | ----------- |
| `messages`           | array (mín. 1)            | sim         |
| `messages[].role`    | `"user"` \| `"assistant"` | sim         |
| `messages[].content` | string (mín. 1 char)      | sim         |

> Mandar o histórico completo da conversa a cada request — o backend não persiste mensagens.

---

## Response — SSE stream

**Headers retornados**

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Formato dos eventos**

Cada chunk de texto:

```
data: {"delta":"texto parcial aqui"}\n\n
```

Fim do stream:

```
data: [DONE]\n\n
```

---

## Como consumir no frontend

### Fetch com ReadableStream (recomendado)

```ts
async function streamAnalysisMessage(
  actChatbotId: string,
  messages: { role: "user" | "assistant"; content: string }[],
  onDelta: (delta: string) => void,
) {
  const res = await fetch(`/acts/${actChatbotId}/analysis/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // guarda linha incompleta

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      const { delta } = JSON.parse(payload) as { delta: string };
      onDelta(delta);
    }
  }
}
```

**Uso:**

```ts
let resposta = "";

await streamAnalysisMessage(actChatbotId, messages, (delta) => {
  resposta += delta;
  setTexto(resposta); // atualiza estado React, por exemplo
});
```

---

### EventSource — NÃO usar

`EventSource` só suporta GET e não permite body/headers customizados. Use `fetch` com `ReadableStream` como acima.

---

## Tratamento de erros

Erros de validação ou negócio (ex: análise não disponível) são lançados **antes** do stream começar — chegam como resposta HTTP normal com status 4xx e body JSON:

```json
{ "status": "ERROR", "message": "Análise com RAG não disponível para este ato." }
```

Verifique `res.ok` antes de iniciar a leitura do stream.

```ts
if (!res.ok) {
  const err = await res.json();
  throw new Error(err.message);
}
```
