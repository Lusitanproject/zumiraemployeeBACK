# Endpoints de referência para montagem de avaliações

Conjunto de endpoints usados pelo construtor de testes (criação/edição de avaliações) para listar
dados de apoio: **nacionalidades**, **blocos de automonitoramento** e **dimensões psicológicas**.

## Autenticação e permissão (igual para os 3)

- **Header**: `Authorization: Bearer <token>`
- **Permissão**: o usuário precisa de **pelo menos uma** das permissões de autoria de avaliação:
  - `assessments-create`
  - `assessments-update-company`
  - `assessments-update-owned`
- Usuário `admin` passa sempre (bypass).

### Respostas de erro comuns

| Status | Quando                                       | Corpo                                                                                                    |
| ------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `401`  | Token ausente/inválido                       | _vazio_                                                                                                  |
| `403`  | Autenticado, mas sem nenhuma das permissões  | `{ "status": "ERROR", "message": "Forbidden" }`                                                          |
| `422`  | Erro de validação (query/params)             | `{ "status": "ERROR", "message": "Erro de validação", "issues": [{ "path": "...", "message": "..." }] }` |
| `400`  | Erro de negócio (ex.: avaliação inexistente) | `{ "status": "ERROR", "message": "<motivo>" }`                                                           |
| `500`  | Erro interno                                 | `{ "status": "ERROR", "message": "Erro interno" }`                                                       |

Envelope de sucesso (sempre): `{ "status": "SUCCESS", "data": { "items": [...] } }` — os 3 endpoints
retornam a lista em `data.items`.

---

## 1. Listar nacionalidades

```
GET /assessments/references/nationalities
```

**Query/params:** nenhum.

**200 — resposta:**

```json
{
  "status": "SUCCESS",
  "data": {
    "items": [{ "id": "ckxx...", "acronym": "BR", "name": "Brasil" }]
  }
}
```

| Campo                  | Tipo            | Observação        |
| ---------------------- | --------------- | ----------------- |
| `data.items[].id`      | `string` (cuid) |                   |
| `data.items[].acronym` | `string`        | sigla (ex.: `BR`) |
| `data.items[].name`    | `string`        |                   |

---

## 2. Listar blocos de automonitoramento

```
GET /assessments/references/self-monitoring-blocks
```

Retorna **todos** os blocos (diferente de `GET /self-monitoring`, que só traz blocos com avaliações
vinculadas).

**Query/params:** nenhum.

**200 — resposta:**

```json
{
  "status": "SUCCESS",
  "data": {
    "items": [{ "id": "ckxx...", "title": "Saúde Mental", "summary": "...", "icon": "brain" }]
  }
}
```

| Campo                  | Tipo             | Observação |
| ---------------------- | ---------------- | ---------- |
| `data.items[].id`      | `string` (cuid)  |            |
| `data.items[].title`   | `string`         |            |
| `data.items[].summary` | `string \| null` | opcional   |
| `data.items[].icon`    | `string \| null` | opcional   |

---

## 3. Listar dimensões psicológicas da avaliação

```
GET /assessments/references/dimensions?assessmentId=<cuid>
```

As dimensões retornadas são as do **bloco de automonitoramento já salvo na avaliação** indicada.

**Query params:**

| Param          | Tipo            | Obrigatório | Observação                                     |
| -------------- | --------------- | ----------- | ---------------------------------------------- |
| `assessmentId` | `string` (cuid) | sim         | ID da avaliação cujo bloco define as dimensões |

**200 — resposta:**

```json
{
  "status": "SUCCESS",
  "data": {
    "items": [{ "id": "uuid...", "acronym": "AUT", "name": "Autonomia" }]
  }
}
```

| Campo                  | Tipo            | Observação |
| ---------------------- | --------------- | ---------- |
| `data.items[].id`      | `string` (uuid) |            |
| `data.items[].acronym` | `string`        |            |
| `data.items[].name`    | `string`        |            |

**Erros específicos:**

- `422` — `assessmentId` ausente ou fora do formato cuid.
- `400` — avaliação não existe (`{ "message": "Avaliação não existe" }`).
- Se a avaliação existir mas o bloco não tiver dimensões: `200` com `items: []`.

---

## Tipos TypeScript (sugestão para o front)

```ts
type ApiSuccess<T> = { status: "SUCCESS"; data: T };

type Nationality = { id: string; acronym: string; name: string };
type SelfMonitoringBlock = {
  id: string;
  title: string;
  summary: string | null;
  icon: string | null;
};
type PsychologicalDimension = { id: string; acronym: string; name: string };

type ListNationalitiesResponse = ApiSuccess<{ items: Nationality[] }>;
type ListBlocksResponse = ApiSuccess<{ items: SelfMonitoringBlock[] }>;
type ListDimensionsResponse = ApiSuccess<{ items: PsychologicalDimension[] }>;
```
