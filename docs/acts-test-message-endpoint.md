# Contrato — `POST /acts/test-message`

Testa o comportamento de um chatbot enviando instruções e mensagens diretamente para a IA. Não requer um ACT existente e não persiste nenhuma informação.

---

**Permissão:** `acts-test`

**Headers:** `Authorization: Bearer <token>`

---

## Body

```json
{
  "instructions": "string (opcional) — prompt de sistema para a IA",
  "messages": [
    { "role": "user" | "assistant", "content": "string (obrigatório)" }
  ]
}
```

- `messages` é obrigatório e deve ter ao menos 1 item
- `instructions` é opcional — se omitido, a IA responde sem prompt de sistema

---

## Response `200` — Server-Sent Events (SSE)

`Content-Type: text/event-stream`

```
data: {"delta":"Olá"}

data: {"delta":"!"}

data: [DONE]
```

- Cada `data: {...}` contém `{ delta: string }` com um fragmento do texto gerado
- `data: [DONE]` indica fim do stream

---

## Erros

| Situação                  | Resposta           |
| ------------------------- | ------------------ |
| Token ausente ou inválido | `401 Unauthorized` |
| Sem permissão `acts-test` | `403 Forbidden`    |
