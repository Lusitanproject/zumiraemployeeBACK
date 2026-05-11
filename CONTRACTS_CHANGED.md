# Contratos Alterados — ACT Analysis

## Resumo

Os endpoints de análise ACT foram movidos do router de companies (`/admin/companies`) para o router de ACTs (`/admin/acts`). O `companyId`, que antes era path parameter, passou a ser **query parameter** — alinhado ao padrão do router de ACTs (`/by-company?companyId=`).

A lógica de análise foi extraída de `CompanyAdminService` para `ActAnalysisAdminService`.

---

## Endpoints Alterados

### 1. Gerar análise de ACT

| | Antes | Depois |
|---|---|---|
| **Método** | `POST` | `POST` |
| **URL** | `/admin/companies/:companyId/acts/:actChatbotId/analysis` | `/admin/acts/:actChatbotId/analysis` |

**Path params — antes:**
```
companyId  (cuid, obrigatório)
actChatbotId  (cuid, obrigatório)
```

**Path params — depois:**
```
actChatbotId  (cuid, obrigatório)
```

**Query params — depois (novo):**
```
companyId  (cuid, obrigatório)
```

**Response (inalterada):**
```json
{ "status": "SUCCESS", "message": "Análise ACT iniciada com sucesso" }
```

---

### 2. Buscar análise de ACT

| | Antes | Depois |
|---|---|---|
| **Método** | `GET` | `GET` |
| **URL** | `/admin/companies/:companyId/acts/:actChatbotId/analysis` | `/admin/acts/:actChatbotId/analysis` |

**Path params — antes:**
```
companyId  (cuid, obrigatório)
actChatbotId  (cuid, obrigatório)
```

**Path params — depois:**
```
actChatbotId  (cuid, obrigatório)
```

**Query params — depois:**
```
companyId      (cuid, obrigatório)
gender         (enum: MALE | FEMALE | OTHER, opcional)
area           (string, opcional)
location       (string, opcional)
occupation     (string, opcional)
occupationLevel (string, opcional)
skinColor      (string, opcional)
hasDisability  (string: "true" | "false", opcional)
nationalityId  (cuid, opcional)
```

> Os filtros `gender`, `area`, `location`, `occupation`, `occupationLevel`, `skinColor`, `hasDisability`, `nationalityId` existiam antes também como query params — não foram alterados, apenas `companyId` migrou de path para query.

**Response (inalterada):**
```json
{
  "status": "SUCCESS",
  "data": {
    "available": false
  }
}
```
ou
```json
{
  "status": "SUCCESS",
  "data": {
    "available": true,
    "items": [...],
    "totalScore": 0,
    "positiveScore": 0,
    "negativeScore": 0,
    "absoluteScore": 0,
    "selfMonitoringBlocks": [...]
  }
}
```

---

### 3. Obter relatório de análise de ACT

| | Antes | Depois |
|---|---|---|
| **Método** | `GET` | `GET` |
| **URL** | `/admin/companies/:companyId/acts/:actChatbotId/analysis/report` | `/admin/acts/:actChatbotId/analysis/report` |

**Path params — antes:**
```
companyId  (cuid, obrigatório)
actChatbotId  (cuid, obrigatório)
```

**Path params — depois:**
```
actChatbotId  (cuid, obrigatório)
```

**Query params — depois (novo):**
```
companyId  (cuid, obrigatório)
```

**Response (inalterada):**
```json
{
  "status": "SUCCESS",
  "data": {
    "available": false
  }
}
```
ou
```json
{
  "status": "SUCCESS",
  "data": {
    "available": true,
    "report": {
      "userCount": 0,
      "overall": {
        "positiveScore": 0,
        "negativeScore": 0,
        "totalScore": 0,
        "absoluteScore": 0,
        "wellnessPercentage": 0
      },
      "byArea": [...],
      "byGender": [...],
      "byDisability": [...],
      "byOccupationLevel": [...],
      "byAgeRange": [...],
      "factorWeights": [...]
    }
  }
}
```

---

### 4. Listar mensagens de um fator psicossocial

| | Antes | Depois |
|---|---|---|
| **Método** | `GET` | `GET` |
| **URL** | `/admin/companies/:companyId/acts/:actChatbotId/analysis/factors/:factorId/messages` | `/admin/acts/:actChatbotId/analysis/factors/:factorId/messages` |

**Path params — antes:**
```
companyId  (cuid, obrigatório)
actChatbotId  (cuid, obrigatório)
factorId  (cuid, obrigatório)
```

**Path params — depois:**
```
actChatbotId  (cuid, obrigatório)
factorId  (cuid, obrigatório)
```

**Query params — depois (novo):**
```
companyId  (cuid, obrigatório)
```

**Response (inalterada):**
```json
{
  "status": "SUCCESS",
  "data": {
    "available": false
  }
}
```
ou
```json
{
  "status": "SUCCESS",
  "data": {
    "available": true,
    "messages": [
      {
        "id": "string",
        "actChapterId": "string",
        "content": "string",
        "role": "user"
      }
    ]
  }
}
```

---

## Endpoints Não Alterados

Os endpoints de companies abaixo **não foram afetados** por esta refatoração:

- `GET    /admin/companies`
- `GET    /admin/companies/feedback`
- `GET    /admin/companies/:companyId`
- `POST   /admin/companies`
- `PUT    /admin/companies/:id`
- `POST   /admin/companies/:id/assessments`
- `POST   /admin/companies/:companyId/feedback/users`

---

## Mudanças Internas (sem impacto no contrato HTTP)

| Arquivo | Alteração |
|---|---|
| `src/services/admin/ActAnalysisAdminService.ts` | **Criado** — contém todos os tipos e métodos de análise ACT extraídos de `CompanyAdminService` |
| `src/services/admin/CompanyAdminService.ts` | Removidos: `generateActAnalysis`, `findActAnalysis`, `findActAnalysisFactorMessages`, `findActAnalysisSegments`, `findActAnalysisFactorWeights`, `generateAnalysisReport` e todos os tipos relacionados |
| `src/routes/admin/act.routes.ts` | Adicionadas as 4 rotas de análise |
| `src/routes/admin/company.routes.ts` | Removidas as 4 rotas de análise |
| `src/schemas/admin/act-analysis.ts` | **Criado** — `ActAnalysisCompanyQuerySchema` e `FindActAnalysisQuerySchema` |
| `src/controllers/admin/acts/analysis/*Controller.ts` (×4) | **Movidos** de `controllers/admin/companies/`; usam `ActAnalysisAdminService` e schemas de `schemas/admin/act-analysis`; `companyId` migrado de `req.params` para `req.query` |
