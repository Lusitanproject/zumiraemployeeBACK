# Contrato — Endpoints de mensagem padronizados

## Padrão adotado

Todos os endpoints de mensagem não-persistentes agora seguem o mesmo contrato:

- `content` — a mensagem atual do usuário (obrigatório)
- `messages` — histórico da conversa anterior (opcional, default `[]`)

O backend combina os dois antes de enviar para a IA:

```
[...messages, { role: "user", content }]
```

**Validação:** se `messages` não estiver vazio, a última mensagem deve ter `role: "assistant"`. Caso contrário a requisição é rejeitada com erro.

---

## `POST /acts/test-message`

**Permissão:** `acts-test`

**Body:**

```json
{
  "content": "string (obrigatório)",
  "instructions": "string (opcional)",
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ]
}
```

- `messages` é opcional (default `[]`) — omitir é equivalente a primeira mensagem
- O nome do usuário autenticado é injetado nas instruções automaticamente

**Response:** SSE stream (`data: {"delta":"..."}` → `data: [DONE]`)

---

## `POST /acts/:actChatbotId/analysis/message`

**Permissão:** `acts-read-analysis`

**Body:**

```json
{
  "content": "string (obrigatório)",
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ]
}
```

**Response:** SSE stream (`data: {"delta":"..."}` → `data: [DONE]`)

---

## `POST /assessments/:assessmentId/analysis/message`

**Permissão:** `assessments-read-analysis`

**Body:**

```json
{
  "content": "string (obrigatório)",
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ]
}
```

**Response:** SSE stream (`data: {"delta":"..."}` → `data: [DONE]`)

---

## `POST /admin/acts/:actChatbotId/test-message`

**Permissão:** `admin-acts-manage`

**Body:**

```json
{
  "content": "string (obrigatório)",
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ]
}
```

**Response:** `{ "status": "SUCCESS", "data": "string" }` (não é stream)

---

## Referência — endpoint persistente (sem mudança)

`POST /acts/message` segue um contrato diferente por ser persistente — usa `actChapterId` para identificar a conversa e recupera o histórico do banco automaticamente:

```json
{ "actChapterId": "cuid", "content": "string" }
```

---

## Erros comuns

| Situação                                                 | Resposta                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `messages` não vazio e última mensagem não é `assistant` | `400` com `"O histórico deve terminar com uma mensagem do assistente"` |
| `content` ausente                                        | `400` erro de validação Zod                                            |
