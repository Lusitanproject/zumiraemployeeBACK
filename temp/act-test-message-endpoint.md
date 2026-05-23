# Contrato — POST /admin/acts/:actChatbotId/test-message

## Descrição

Testa a conversa com um Act Chatbot sem criar ou persistir nenhum chapter/mensagem no banco. Útil para validar as `messageInstructions` configuradas no ACT.

---

## Autenticação

- Bearer token obrigatório
- Permissão necessária: `admin-acts-manage`

---

## Request

**Path param**

| Parâmetro    | Tipo          | Obrigatório | Descrição          |
| ------------ | ------------- | ----------- | ------------------ |
| actChatbotId | string (cuid) | sim         | ID do ACT a testar |

**Body (JSON)**

```json
{
  "messages": [
    { "role": "user", "content": "Olá, como você está?" },
    { "role": "assistant", "content": "Estou bem! E você?" },
    { "role": "user", "content": "Estou ótimo." }
  ]
}
```

| Campo              | Tipo                      | Obrigatório | Descrição                      |
| ------------------ | ------------------------- | ----------- | ------------------------------ |
| messages           | array                     | sim (min 1) | Histórico completo da conversa |
| messages[].role    | `"user"` \| `"assistant"` | sim         | Papel do autor da mensagem     |
| messages[].content | string (não vazio)        | sim         | Conteúdo da mensagem           |

> Se o ACT tiver `initialMessage` configurado, ele é inserido automaticamente como primeira mensagem de `assistant` antes do histórico enviado.

---

## Response

**200 OK**

```json
{
  "status": "SUCCESS",
  "data": "Que ótimo ouvir isso! Me conta mais sobre o seu dia."
}
```

| Campo  | Tipo   | Descrição                    |
| ------ | ------ | ---------------------------- |
| status | string | Sempre `"SUCCESS"`           |
| data   | string | Resposta gerada pelo chatbot |

---

## Erros

| Status | Situação                                                     |
| ------ | ------------------------------------------------------------ |
| 400    | Body inválido (messages vazio, role inválido, content vazio) |
| 401    | Token ausente ou inválido                                    |
| 403    | Usuário sem permissão `admin-acts-manage`                    |
| 400    | `actChatbotId` não encontrado                                |

---

## Exemplo curl

```bash
curl -X POST https://api.exemplo.com/admin/acts/clxxxxxxxxxxxxxx/test-message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Olá!" }
    ]
  }'
```
