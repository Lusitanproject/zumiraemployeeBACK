# RAG Analysis Message Endpoints

Endpoints para conversa consultiva com RAG sobre análises de empresa. Requerem que a análise já tenha sido gerada (via `generateCompanyFeedback` ou `generateAnalysisReport`) e possua um vector store associado.

---

## POST /assessments/:assessmentId/analysis/message

Envia uma mensagem ao RAG da análise de assessment mais recente da empresa do usuário autenticado.

### Path params

| Campo        | Tipo   | Obrigatório | Descrição               |
|--------------|--------|-------------|-------------------------|
| assessmentId | string (cuid) | sim | ID do assessment        |

### Headers

| Header        | Valor                    |
|---------------|--------------------------|
| Authorization | Bearer `<token>`         |
| Content-Type  | application/json         |

### Request body

```json
{
  "messages": [
    { "role": "user", "content": "Quais fatores mais impactaram o resultado?" }
  ]
}
```

| Campo              | Tipo   | Obrigatório | Descrição                                                                 |
|--------------------|--------|-------------|---------------------------------------------------------------------------|
| messages           | array  | sim         | Histórico da conversa (mínimo 1 item)                                     |
| messages[].role    | string | sim         | `"user"` ou `"assistant"`                                                 |
| messages[].content | string | sim         | Texto da mensagem (mínimo 1 caractere)                                    |

### Response — 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "text": "Os fatores com maior impacto negativo foram..."
  }
}
```

### Erros

| Status | Mensagem                                                          | Causa                                                            |
|--------|-------------------------------------------------------------------|------------------------------------------------------------------|
| 400    | Validation error nos params/body                                  | `assessmentId` inválido ou `messages` mal formatado              |
| 401    | Unauthorized                                                      | Token ausente ou inválido                                        |
| 400    | Usuário não está associado a uma empresa.                         | Usuário sem `companyId`                                          |
| 400    | Análise com RAG não disponível para este assessment.              | Análise não gerada ou sem vector store (chamar generate feedback primeiro) |

---

## POST /acts/:actChatbotId/analysis/message

Envia uma mensagem ao RAG da análise de ACT mais recente da empresa do usuário autenticado.

### Path params

| Campo        | Tipo          | Obrigatório | Descrição           |
|--------------|---------------|-------------|---------------------|
| actChatbotId | string (cuid) | sim         | ID do ACT           |

### Headers

| Header        | Valor                    |
|---------------|--------------------------|
| Authorization | Bearer `<token>`         |
| Content-Type  | application/json         |

### Request body

```json
{
  "messages": [
    { "role": "user", "content": "Como está o índice de bem-estar geral?" },
    { "role": "assistant", "content": "O índice de bem-estar está em 72%." },
    { "role": "user", "content": "E por fator psicossocial?" }
  ]
}
```

| Campo              | Tipo   | Obrigatório | Descrição                                                                 |
|--------------------|--------|-------------|---------------------------------------------------------------------------|
| messages           | array  | sim         | Histórico da conversa (mínimo 1 item)                                     |
| messages[].role    | string | sim         | `"user"` ou `"assistant"`                                                 |
| messages[].content | string | sim         | Texto da mensagem (mínimo 1 caractere)                                    |

### Response — 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "text": "Analisando por fator psicossocial, o fator Autonomia apresentou..."
  }
}
```

### Erros

| Status | Mensagem                                                    | Causa                                                          |
|--------|-------------------------------------------------------------|----------------------------------------------------------------|
| 400    | Validation error nos params/body                            | `actChatbotId` inválido ou `messages` mal formatado            |
| 401    | Unauthorized                                                | Token ausente ou inválido                                      |
| 400    | Usuário não está associado a uma empresa.                   | Usuário sem `companyId`                                        |
| 400    | Análise com RAG não disponível para este ato.               | Análise não gerada ou sem vector store (chamar generate report primeiro) |

---

## Notas de uso

- O campo `messages` deve conter o **histórico completo** da conversa até o momento — o backend não mantém sessão. O frontend é responsável por acumular as mensagens a cada turno.
- O vector store é criado automaticamente na primeira chamada aos endpoints de geração de análise (`POST /assessments/:id/feedback/company` e `GET /acts/:id/analysis/report`). Só depois disso esses endpoints de mensagem ficam disponíveis.
- As instruções do assistente (tom, foco, escopo) são configuradas pelos campos `consultiveAiInstructions` nas tabelas `Assessment` e `ActChatbot`.
