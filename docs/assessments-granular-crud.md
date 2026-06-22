# Assessments — CRUD granular fora de `/admin` (contratos p/ front)

Mudança de contrato no domínio de **avaliações/testes** (`Assessment`), espelhando o que já existe em
**atos**. Agora o admin-empresa gerencia os próprios testes fora de `/admin`, com acesso por escopo
**owner / company / platform**.

Todas as respostas seguem o envelope padrão:

```json
{ "status": "SUCCESS", "data": <payload> }
```

Erros: `403 { "status": "ERROR", "message": "Forbidden" }` (sem permissão / recurso de outra empresa /
recurso Zumira), `422` para validação (`{ status, message, issues: [{ path, message }] }`).

---

## ⚠️ Breaking changes (ação no front)

1. **`PUT /assessments/questions/{id}` foi REMOVIDO.** Use **`PUT /assessments/{id}/questions`**
   (mesmo body de sync em lote; agora `{id}` é o **ID da avaliação**, não da pergunta).
2. **`POST /assessments`** deixou de exigir `admin-assessments-manage` e passou a exigir
   **`assessments-create`**. O `companyId`/`ownerId` do teste passam a ser setados a partir do usuário
   autenticado (não enviar no body). Para criar teste **Zumira/platform** (sem empresa) use o novo
   **`POST /admin/assessments`**.
3. **Permissão `assessments-read-analysis` deixou de existir.** Foi quebrada em três:
   `assessments-read-analysis-company`, `-owned`, `-platform`. Endpoints de análise agora validam por
   escopo do dono da avaliação.
4. **`POST /assessments/questions`** continua existindo mas está **deprecado** (prefira o `PUT` de lote).

---

## Permissões (novas keys)

| Key                                                          | Uso                                            |
| ------------------------------------------------------------ | ---------------------------------------------- |
| `assessments-create`                                         | Criar teste (vinculado à própria empresa)      |
| `assessments-read-company` / `-owned` / `-platform`          | Listar no painel (empresa / próprios / Zumira) |
| `assessments-update-company` / `-owned`                      | Editar teste (campos, perguntas, ratings)      |
| `assessments-delete-company` / `-owned`                      | Deletar teste                                  |
| `assessments-read-analysis-company` / `-owned` / `-platform` | Ver análise/resultados/feedback                |
| `assessments-engage`                                         | (inalterada) responder/detalhar teste          |

Escopos: **company** = `companyId` é o da minha empresa; **owned** = `ownerId` sou eu; **platform** =
teste Zumira (`companyId = null`, criado via `/admin`) — **nunca** editável/deletável fora de `/admin`.
`admin` ignora todas as checagens.

---

## Endpoints novos

### `POST /assessments` — Criar teste (empresa)

- **Permissão:** `assessments-create` (+ usuário precisa ter empresa).
- **Body:**

```json
{
  "title": "string",
  "summary": "string",
  "description": "string?",
  "selfMonitoringBlockId": "cuid",
  "userFeedbackInstructions": "string?",
  "companyFeedbackInstructions": "string?",
  "consultiveAiInstructions": "string?",
  "operationType": "SUM | AVERAGE",
  "nationalityId": "cuid",
  "public": true
}
```

- **Resposta `data`:**

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string",
  "description": "string|null",
  "selfMonitoringBlockId": "cuid",
  "companyId": "cuid|null",
  "ownerId": "cuid|null"
}
```

### `GET /assessments/panel` — Listar testes do painel

- **Permissão:** pelo menos uma de `assessments-read-company` / `-owned` / `-platform`.
- O conjunto varia conforme as permissões (empresa + próprios + Zumira, deduplicados).
- **Resposta `data`:** array de

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string",
  "public": true,
  "companyId": "cuid|null",
  "ownerId": "cuid|null",
  "selfMonitoringBlock": { "id": "cuid", "title": "string" },
  "createdAt": "ISO"
}
```

### `GET /assessments/{id}/config` — Config completa para edição

- **Permissão:** `assessments-update-company` **ou** `-owned` (recurso da empresa ou próprio).
- **Resposta `data`:** tudo num payload só:

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string",
  "description": "string|null",
  "selfMonitoringBlockId": "cuid",
  "userFeedbackInstructions": "string|null",
  "companyFeedbackInstructions": "string|null",
  "consultiveAiInstructions": "string|null",
  "operationType": "SUM | AVERAGE",
  "nationalityId": "cuid",
  "public": true,
  "companyId": "cuid|null",
  "ownerId": "cuid|null",
  "createdAt": "ISO",
  "updatedAt": "ISO",
  "assessmentQuestions": [
    {
      "id": "uuid",
      "description": "string",
      "index": 0,
      "psychologicalDimensionId": "uuid",
      "assessmentQuestionChoices": [{ "id": "uuid", "label": "string", "value": 0, "index": 0 }]
    }
  ],
  "assessmentResultRatings": [{ "id": "uuid", "risk": "string", "profile": "string", "color": "#RRGGBB" }]
}
```

### `PUT /assessments/{id}` — Atualizar campos do teste

- **Permissão:** `assessments-update-company` **ou** `-owned`.
- **Body:** (igual ao update admin; `id` também vai no body — o do path prevalece)

```json
{
  "id": "cuid",
  "title": "string",
  "summary": "string?",
  "description": "string?",
  "selfMonitoringBlockId": "cuid?",
  "userFeedbackInstructions": "string?",
  "companyFeedbackInstructions": "string?",
  "consultiveAiInstructions": "string?",
  "operationType": "SUM | AVERAGE",
  "nationalityId": "cuid",
  "public": true
}
```

- **Resposta `data`:** o `Assessment` atualizado.

### `DELETE /assessments/{id}` — Deletar teste

- **Permissão:** `assessments-delete-company` **ou** `-owned`.
- **Resposta `data`:** `{}`.

### `PUT /assessments/{id}/questions` — Sincronizar perguntas (lote)

- **Permissão:** `assessments-update-company` **ou** `-owned`.
- Reconcilia o conjunto inteiro: item **sem `id`** → cria; com `id` alterado → atualiza; ausente → remove
  (idem opções).
- **Body:**

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

- **Resposta `data`:** `{}`.

### `PUT /assessments/{id}/ratings` — Atualizar faixas de risco

- **Permissão:** `assessments-update-company` **ou** `-owned`.
- Substitui integralmente as faixas; item sem `id` cria, com `id` atualiza.
- **Body:**

```json
{
  "ratings": [{ "id": "uuid?", "risk": "string", "profile": "string", "color": "#RRGGBB" }]
}
```

### `POST /admin/assessments` — Criar teste Zumira (platform) [Admin]

- **Permissão:** `admin-assessments-manage`. Mesmo body do `POST /assessments`, mas **sem** company/owner
  (teste fica `companyId = null`).

---

## Endpoints alterados (mesma URL/body, permissão mudou)

Análise por avaliação — agora exigem escopo conforme o dono do teste (e `companyId` da própria empresa
via query, como antes):

| Endpoint                                            | Permissão nova                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `POST /assessments/{assessmentId}/analysis/message` | uma de `assessments-read-analysis-{company,owned,platform}` (pelo dono)   |
| `GET /assessments/{id}/results`                     | idem                                                                      |
| `GET /assessments/{id}/results/user-filters`        | idem                                                                      |
| `POST /assessments/feedback/companies/{id}`         | idem (`{id}` = ID da avaliação)                                           |
| `POST /assessments/feedback/users/{id}`             | **qualquer uma** das 3 `read-analysis-*` (`{id}` = `AssessmentResult.id`) |
| `GET /companies/{id}/feedback`                      | **qualquer uma** das 3 `read-analysis-*` (`{id}` = empresa)               |

---

## Comportamento alterado (sem mudança de contrato)

- `GET /assessments` e `GET /assessments/company` (listagens de engajamento) agora **incluem
  automaticamente os testes criados pela própria empresa** (`companyId` da empresa do usuário), além dos
  testes Zumira já disponibilizados via `CompanyAvailableAssessment`. Shapes de resposta inalterados.

---

## Deprecado

- `POST /assessments/questions` (criar pergunta isolada) — ainda funciona (`admin-assessments-manage`),
  mas prefira `PUT /assessments/{id}/questions`.
