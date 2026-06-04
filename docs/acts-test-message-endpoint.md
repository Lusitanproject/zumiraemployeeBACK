# Contrato — `POST /acts/:id/test-message`

Testa o comportamento do chatbot de um ACT próprio sem persistir nenhuma informação. As instruções são passadas no payload — nada é lido do banco além da verificação de posse.

---

## Detalhes

**Permissão:** `acts-test`

**Headers:** `Authorization: Bearer <token>`

**Path param:** `id` — cuid do ACT

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
- `initialMessage` do ACT **não** é inserida automaticamente no histórico

---

## Response `200` — Server-Sent Events (SSE)

`Content-Type: text/event-stream`

O endpoint responde como stream. Cada token chega num evento separado:

```
data: {"delta":"Olá"}

data: {"delta":"!"}

data: [DONE]
```

- Cada linha `data: {...}` contém um objeto `{ delta: string }` com um fragmento do texto gerado
- `data: [DONE]` indica fim do stream

---

## Erros

| Situação                      | Resposta                                                             |
| ----------------------------- | -------------------------------------------------------------------- |
| Token ausente ou inválido     | `401 Unauthorized`                                                   |
| Sem permissão `acts-test`     | `403 Forbidden`                                                      |
| Usuário sem empresa associada | `403 Forbidden`                                                      |
| ACT não pertence à empresa    | Erro com mensagem `"Ato não encontrado ou sem permissão para teste"` |
