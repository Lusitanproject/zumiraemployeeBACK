# Mudanças de contrato — campo `similarExposureGroup`

Adição do campo `similarExposureGroup` (GES — Grupo de Exposição Similar) ao model `User`.

---

## `POST /users` — Auto-cadastro público

Novo campo opcional no body.

```json
{
  "name": "string (obrigatório)",
  "email": "string (obrigatório)",
  "password": "string (opcional)",
  "similarExposureGroup": "string (opcional)"
}
```

---

## `PUT /users/:id` — Atualizar usuário

Novo campo opcional no body.

```json
{
  "similarExposureGroup": "string (opcional)"
}
```

---

## `GET /users/search` — Busca paginada

Novo query param de filtro.

| Parâmetro              | Tipo     | Comportamento                    |
| ---------------------- | -------- | -------------------------------- |
| `similarExposureGroup` | `string` | Filtro parcial, case-insensitive |

**Exemplo:** `GET /users/search?similarExposureGroup=GES-A`

---

## `GET /users/filters` — Valores distintos para filtros

`similarExposureGroup` agora é um valor aceito no param `columns`.

**Exemplo:** `GET /users/filters?columns=similarExposureGroup`

**Response:**

```json
{
  "similarExposureGroup": ["GES-A", "GES-B", "GES-C"]
}
```

---

## Todos os endpoints de leitura

`GET /users`, `GET /users/:userId`, `GET /users/find-by`, `GET /users/company/:companyId`

O campo `similarExposureGroup` agora pode ter valor não-nulo nas respostas.

```json
{
  "id": "uuid",
  "name": "string",
  "similarExposureGroup": "string | null"
}
```
