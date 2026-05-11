# API Breaking Changes

## `GET /admin/acts/:actChatbotId/analysis`

**Data:** 2026-05-11

**Breaking change:** O contrato de resposta foi alterado para suportar paginação.

| Campo | Antes | Depois |
|---|---|---|
| `available` | ✅ mantido | ✅ mantido |
| `items` | array completo | array paginado (slice da página atual) |
| `totalScore` | presente | **removido** → movido para `/summary` |
| `positiveScore` | presente | **removido** → movido para `/summary` |
| `negativeScore` | presente | **removido** → movido para `/summary` |
| `absoluteScore` | presente | **removido** → movido para `/summary` |
| `selfMonitoringBlocks` | presente | **removido** → movido para `/summary` |
| `total` | ausente | **adicionado** (total de itens filtrados) |
| `page` | ausente | **adicionado** |
| `pageSize` | ausente | **adicionado** |
| `totalPages` | ausente | **adicionado** |

**Novos query params:** `page` (default: 1), `pageSize` (default: 10, max: 100) e `search` (busca textual no nome do fator psicossocial).

**Filtros disponíveis em ambos os endpoints:** `search`, `gender`, `area`, `location`, `occupation`, `occupationLevel`, `skinColor`, `hasDisability`, `nationalityId`.

---

## `GET /admin/acts/:actChatbotId/analysis/summary` — novo endpoint

Retorna os scores calculados sobre **todos** os dados filtrados (sem paginação):
`totalScore`, `positiveScore`, `negativeScore`, `absoluteScore`, `selfMonitoringBlocks`.

Aceita os mesmos filtros do endpoint de análise (exceto `page`/`pageSize`).
