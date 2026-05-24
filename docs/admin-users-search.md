# Admin Users — Contrato de API

---

## GET /admin/users/search

**Auth:** Bearer token com permissão `manage-users`

### Query Parameters

| Parâmetro         | Tipo    | Obrigatório | Default | Descrição                                |
| ----------------- | ------- | ----------- | ------- | ---------------------------------------- |
| `page`            | number  | não         | `1`     | Página atual (1-indexed)                 |
| `pageSize`        | number  | não         | `10`    | Itens por página (máx. 100)              |
| `search`          | string  | não         | —       | Busca parcial em `name` ou `email` (OR)  |
| `companyId`       | string  | não         | —       | CUID — filtra pela empresa               |
| `roleId`          | string  | não         | —       | UUID — filtra pelo role                  |
| `gender`          | string  | não         | —       | `MALE` \| `FEMALE` \| `OTHER`            |
| `occupation`      | string  | não         | —       | Contém (case-insensitive)                |
| `occupationLevel` | string  | não         | —       | Contém (case-insensitive)                |
| `area`            | string  | não         | —       | Contém (case-insensitive)                |
| `location`        | string  | não         | —       | Contém (case-insensitive)                |
| `skinColor`       | string  | não         | —       | Contém (case-insensitive)                |
| `hasDisability`   | boolean | não         | —       | Enviar como string `"true"` ou `"false"` |
| `nationalityId`   | string  | não         | —       | CUID — filtra pela nacionalidade         |

### Resposta `200`

```json
{
  "status": "SUCCESS",
  "data": {
    "users": [
      {
        "id": "...",
        "name": "...",
        "email": "...",
        "gender": "MALE",
        "occupation": "...",
        "occupationLevel": "...",
        "area": "...",
        "location": "...",
        "skinColor": "...",
        "hasDisability": false,
        "customId": "...",
        "phoneNumber": "...",
        "birthdate": "2000-01-01T00:00:00.000Z",
        "admissionDate": "2022-06-01T00:00:00.000Z",
        "nationalityId": "...",
        "companyId": "...",
        "roleId": "...",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "company": { "id": "...", "name": "..." },
        "role": { "id": "...", "slug": "..." }
      }
    ],
    "total": 42,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### Exemplos

```
GET /admin/users/search
GET /admin/users/search?search=gabriel&page=2&pageSize=20
GET /admin/users/search?gender=MALE&roleId=<uuid>&companyId=<cuid>
GET /admin/users/search?hasDisability=true&area=Tecnologia
```

---

## GET /admin/users/filters

**Auth:** Bearer token com permissão `manage-users`

Retorna, para cada coluna solicitada, os valores distintos que existem no banco.
Colunas de referência retornam `{ id, nome_legível }` em vez do ID bruto.

### Query Parameters

| Parâmetro | Tipo     | Obrigatório | Descrição                                              |
| --------- | -------- | ----------- | ------------------------------------------------------ |
| `columns` | string[] | sim (≥ 1)   | Lista de colunas. Repetir o param ou enviar como array |

**Valores válidos para `columns`:**

| Valor             | Tipo       | Retorno                         |
| ----------------- | ---------- | ------------------------------- |
| `gender`          | escalar    | `"MALE" \| "FEMALE" \| "OTHER"` |
| `occupation`      | escalar    | `string[]`                      |
| `occupationLevel` | escalar    | `string[]`                      |
| `area`            | escalar    | `string[]`                      |
| `location`        | escalar    | `string[]`                      |
| `skinColor`       | escalar    | `string[]`                      |
| `hasDisability`   | escalar    | `boolean[]`                     |
| `roleId`          | referência | `{ id, slug }[]`                |
| `companyId`       | referência | `{ id, name }[]`                |
| `nationalityId`   | referência | `{ id, name }[]`                |

### Resposta `200`

```json
{
  "status": "SUCCESS",
  "data": {
    "gender": ["MALE", "FEMALE"],
    "area": ["Marketing", "Tecnologia", "Vendas"],
    "hasDisability": [false, true],
    "roleId": [
      { "id": "uuid-1", "slug": "admin" },
      { "id": "uuid-2", "slug": "user" }
    ],
    "companyId": [
      { "id": "cuid-1", "name": "Empresa A" },
      { "id": "cuid-2", "name": "Empresa B" }
    ],
    "nationalityId": [{ "id": "cuid-3", "name": "Brasileiro" }]
  }
}
```

Apenas as colunas solicitadas aparecem na resposta.

### Resposta `400` — coluna inválida ou `columns` ausente

```json
{
  "status": "ERROR",
  "message": "..."
}
```

### Exemplos

```
GET /admin/users/filters?columns=gender&columns=area&columns=roleId
GET /admin/users/filters?columns=companyId&columns=nationalityId&columns=hasDisability
GET /admin/users/filters?columns=occupation&columns=occupationLevel&columns=location
```
