# Contrato — `GET /acts/:id/config`

Retorna todos os campos de configuração de um ACT. Exclusivo para ACTs pertencentes à empresa do usuário.

**Permissão:** `acts-update`

**Headers:** `Authorization: Bearer <token>`

**Path param:** `id` — cuid do ACT

---

## Response `200`

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "icon": "string",
    "published": "boolean",
    "companyId": "string",
    "initialMessage": "string | null",
    "messageInstructions": "string | null",
    "compilationInstructions": "string | null",
    "reportGenerationInstructions": "string | null",
    "reportLookupInstructions": "string | null",
    "individualAnalysisInstructions": "string | null",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

## Erros

| Situação                      | Resposta                                                            |
| ----------------------------- | ------------------------------------------------------------------- |
| Token ausente ou inválido     | `401 Unauthorized`                                                  |
| Sem permissão `acts-update`   | `403 Forbidden`                                                     |
| Usuário sem empresa associada | `403 Forbidden`                                                     |
| ACT não pertence à empresa    | Erro com mensagem `"Ato não encontrado ou sem permissão de acesso"` |
