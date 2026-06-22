# Admin Assessments — Contratos completos (`/admin/assessments/*`)

Todos os endpoints exigem autenticação (`Authorization: Bearer <token>`) e permissão
`admin-assessments-manage`. Todas as respostas seguem o envelope padrão:

```json
{ "status": "SUCCESS", "data": <payload> }
```

Erros: `401` sem token, `403` sem permissão, `422` falha de validação Zod
(`{ status, message, issues: [{ path, message }] }`).

---

## `POST /admin/assessments` — Criar teste Zumira (platform)

Cria um teste sem empresa/dono (`companyId = null`, `ownerId = null`), disponível para vincular a
empresas via `CompanyAvailableAssessment`.

**Body:**

| Campo                         | Tipo                 | Obrigatório |
| ----------------------------- | -------------------- | ----------- |
| `title`                       | `string`             | ✅          |
| `summary`                     | `string`             | ✅          |
| `selfMonitoringBlockId`       | `cuid`               | ✅          |
| `operationType`               | `"SUM" \| "AVERAGE"` | ✅          |
| `nationalityId`               | `cuid`               | ✅          |
| `public`                      | `boolean`            | ✅          |
| `description`                 | `string`             | —           |
| `userFeedbackInstructions`    | `string`             | —           |
| `companyFeedbackInstructions` | `string`             | —           |
| `consultiveAiInstructions`    | `string`             | —           |

> `openaiAssistantId` **não existe** no schema — ignorado se enviado, não causa erro.

**Resposta `data`:**

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string",
  "description": "string | null",
  "selfMonitoringBlockId": "cuid",
  "companyId": null,
  "ownerId": null
}
```

---

## `GET /admin/assessments` — Listar todos os testes

Retorna **todos** os testes do sistema sem filtro (platform + empresa + owned misturados).

**Sem query params.**

**Resposta `data`:**

> ⚠️ `data` é um objeto com chave `assessments`, não um array direto.

```json
{
  "assessments": [
    {
      "id": "cuid",
      "title": "string",
      "summary": "string",
      "public": true,
      "selfMonitoring": { "id": "cuid", "title": "string" },
      "lastCompleted": "ISO 8601 | Invalid Date"
    }
  ]
}
```

> ⚠️ O campo é `selfMonitoring`, não `selfMonitoringBlock`.  
> ⚠️ `lastCompleted` é `Invalid Date` quando o teste nunca foi respondido — tratar no front.

---

## `GET /admin/assessments/{id}` — Detalhar teste

Retorna **apenas os campos escalares** da avaliação.

> ⚠️ O Swagger documenta `questions` e `ratings` no `data`, mas o código **não os inclui**.
> Para montar a tela de edição, chamar `GET /questions/{assessmentId}` e `GET /ratings/{id}` separadamente.

**Resposta `data`:**

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string",
  "description": "string | null",
  "selfMonitoringBlockId": "cuid",
  "userFeedbackInstructions": "string | null",
  "companyFeedbackInstructions": "string | null",
  "consultiveAiInstructions": "string | null",
  "public": true,
  "operationType": "SUM | AVERAGE",
  "nationalityId": "cuid"
}
```

---

## `PUT /admin/assessments/{id}` — Atualizar teste

> ⚠️ O schema Zod exige `id` **no body também** (além do path). Enviar sem `id` retorna 422.
> O valor pode ser igual ao do path (o path sempre prevalece no update).

**Body:**

| Campo                         | Tipo                 | Obrigatório              |
| ----------------------------- | -------------------- | ------------------------ |
| `id`                          | `cuid`               | ✅ (mesmo valor do path) |
| `title`                       | `string`             | ✅                       |
| `operationType`               | `"SUM" \| "AVERAGE"` | ✅                       |
| `nationalityId`               | `cuid`               | ✅                       |
| `public`                      | `boolean`            | ✅                       |
| `summary`                     | `string`             | —                        |
| `description`                 | `string`             | —                        |
| `selfMonitoringBlockId`       | `cuid`               | —                        |
| `userFeedbackInstructions`    | `string`             | —                        |
| `companyFeedbackInstructions` | `string`             | —                        |
| `consultiveAiInstructions`    | `string`             | —                        |

**Resposta `data`:** objeto Assessment completo (todos os campos do model, sem select restrito).

---

## `POST /admin/assessments/duplicate/{id}` — Duplicar teste

Cria uma cópia completa do teste incluindo perguntas, opções e faixas de risco. O título recebe
sufixo `(N)` para evitar colisão.

**Sem body.**

**Resposta `data`:**

> ⚠️ `public` **não está** no select — não vem na resposta. Buscar separado se necessário.

```json
{
  "id": "cuid",
  "title": "string (título original + (N))",
  "summary": "string",
  "description": "string | null",
  "selfMonitoringBlockId": "cuid",
  "operationType": "SUM | AVERAGE",
  "nationalityId": "cuid",
  "userFeedbackInstructions": "string | null",
  "companyFeedbackInstructions": "string | null"
}
```

---

## `GET /admin/assessments/questions/{assessmentId}` — Listar perguntas

`{assessmentId}` = ID da avaliação.

**Resposta `data`:**

> ⚠️ `data` é um objeto com chave `questions`, não um array direto.

```json
{
  "questions": [
    {
      "id": "uuid",
      "index": 0,
      "assessmentId": "cuid",
      "description": "string",
      "updatedAt": "ISO 8601",
      "psychologicalDimension": {
        "id": "uuid",
        "acronym": "string",
        "name": "string"
      },
      "assessmentQuestionChoices": [{ "id": "uuid", "index": 0, "label": "string", "value": 0 }]
    }
  ]
}
```

---

## `PUT /admin/assessments/questions/{id}` — Sincronizar perguntas (lote)

`{id}` = ID da avaliação.

Reconcilia o conjunto inteiro: item **sem `id`** → cria; com `id` → atualiza; ausente do array →
remove. Idem para as choices de cada pergunta.

**Body:**

```json
{
  "questions": [
    {
      "id": "uuid?",
      "description": "string",
      "index": 0,
      "psychologicalDimensionId": "uuid",
      "choices": [{ "id": "uuid?", "label": "string", "value": 0, "index": 0 }]
    }
  ]
}
```

**Resposta `data`:** `{}`

---

## `GET /admin/assessments/ratings/{id}` — Listar faixas de risco

`{id}` = ID da avaliação.

**Resposta `data`:**

> ⚠️ `data` é um objeto com chave `items`, não um array direto.

```json
{
  "items": [{ "id": "uuid", "risk": "string", "profile": "string", "color": "#RRGGBB" }]
}
```

---

## `PUT /admin/assessments/ratings/{id}` — Atualizar faixas de risco

`{id}` = ID da avaliação.

Substitui integralmente as faixas: sem `id` → cria; com `id` → atualiza; ausente do array → remove.

**Body:**

```json
{
  "ratings": [{ "id": "uuid?", "risk": "string", "profile": "string", "color": "#RRGGBB" }]
}
```

> `color`: regex `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$` — `#RRGGBB` ou `#RGB`.

**Resposta `data`:** `{}`

---

## `GET /admin/assessments/results` — Resultados filtrados

Retorna apenas resultados que têm **feedback gerado** e **classificação de risco atribuída**.
Um resultado por usuário (o mais recente).

**Query params:**

| Param          | Tipo   | Descrição             |
| -------------- | ------ | --------------------- |
| `assessmentId` | `cuid` | Filtrar por avaliação |
| `companyId`    | `cuid` | Filtrar por empresa   |

> ⚠️ O Swagger menciona `startDate`/`endDate` mas o código **não os lê** — não filtram nada.

**Resposta `data`:**

> ⚠️ `data` é um objeto com chave `items`, não um array direto.

```json
{
  "items": [
    {
      "id": "uuid",
      "user": {
        "id": "cuid",
        "name": "string | null",
        "email": "string",
        "companyId": "cuid | null",
        "customId": "string | null"
      },
      "assessmentResultRating": {
        "risk": "string",
        "profile": "string",
        "color": "string"
      },
      "createdAt": "ISO 8601",
      "scores": [...]
    }
  ]
}
```

---

## `GET /admin/assessments/results/download-report` — Relatório Excel

**Query params:** mesmos de `GET /results` (`assessmentId`, `companyId`).

Retorna blob `.xlsx` com `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
e `Content-Disposition: attachment`.

---

## Armadilhas globais (ler antes de implementar)

| #   | Endpoint              | Armadilha                                                                                                                            |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `PUT /:id`            | `id` **obrigatório no body** além do path — sem ele retorna 422                                                                      |
| 2   | `GET /`               | `data.assessments[...]`, não `data[...]`; campo `selfMonitoring`, não `selfMonitoringBlock`; `lastCompleted` pode ser `Invalid Date` |
| 3   | `GET /:id`            | Sem perguntas e sem ratings na resposta, apesar do Swagger dizer o contrário                                                         |
| 4   | `GET /questions/:id`  | `data.questions[...]`, não `data[...]`                                                                                               |
| 5   | `GET /ratings/:id`    | `data.items[...]`, não `data[...]`                                                                                                   |
| 6   | `GET /results`        | `data.items[...]`, não `data[...]`; `startDate`/`endDate` não funcionam                                                              |
| 7   | `POST /duplicate/:id` | `public` não vem na resposta                                                                                                         |
