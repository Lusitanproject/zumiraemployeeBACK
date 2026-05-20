# Company Users CRUD — Contrato de API

Endpoints para gerenciamento de usuários de uma empresa por um **admin-empresa** (`manage-company`).

Isolamento garantido por middleware: um admin-empresa só acessa o `companyId` do próprio role. O admin Zumira (`role = "admin"`) acessa qualquer empresa.

---

## Autenticação

Todos os endpoints exigem `Authorization: Bearer <token>`.

---

## Endpoints

### `GET /companies/:companyId/users`

Lista todos os usuários da empresa.

**Permissão:** `manage-company`

**Path params**

| Param | Tipo | Descrição |
|---|---|---|
| `companyId` | `cuid` | ID da empresa |

**Response `200`**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "customId": "string | null",
      "occupation": "string | null",
      "occupationLevel": "string | null",
      "area": "string | null",
      "similarExposureGroup": "string | null",
      "location": "string | null",
      "skinColor": "string | null",
      "hasDisability": "boolean | null",
      "gender": "MALE | FEMALE | OTHER | null",
      "birthdate": "ISO8601 | null",
      "admissionDate": "ISO8601 | null",
      "phoneNumber": "string | null",
      "companyId": "cuid | null",
      "roleId": "uuid",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "company": { "id": "cuid", "name": "string" },
      "role": { "id": "uuid", "slug": "string" }
    }
  ]
}
```

**Erros**

| Status | Motivo |
|---|---|
| `401` | Token ausente ou inválido |
| `403` | Sem permissão ou `companyId` de outra empresa |

---

### `GET /companies/:companyId/users/search`

Busca paginada de usuários da empresa com filtros opcionais. O `companyId` é sempre forçado pelo middleware — não pode ser sobrescrito pelo caller.

**Permissão:** `manage-company`

**Path params**

| Param | Tipo | Descrição |
|---|---|---|
| `companyId` | `cuid` | ID da empresa |

**Query params** (todos opcionais salvo `page`/`pageSize`)

| Param | Tipo | Default | Descrição |
|---|---|---|---|
| `page` | `number` | `1` | Página |
| `pageSize` | `number` | `10` | Itens por página (max 100) |
| `search` | `string` | — | Busca por nome ou e-mail (case-insensitive) |
| `roleId` | `uuid` | — | Filtro por cargo |
| `gender` | `MALE \| FEMALE \| OTHER` | — | Filtro por gênero |
| `occupation` | `string` | — | Filtro por ocupação (contains) |
| `occupationLevel` | `string` | — | Filtro por nível de ocupação (contains) |
| `area` | `string` | — | Filtro por área (contains) |
| `similarExposureGroup` | `string` | — | Filtro por grupo de exposição (contains) |
| `location` | `string` | — | Filtro por localidade (contains) |
| `skinColor` | `string` | — | Filtro por cor de pele (contains) |
| `hasDisability` | `"true" \| "false"` | — | Filtro por PCD |
| `nationalityId` | `cuid` | — | Filtro por nacionalidade |

**Response `200`**
```json
{
  "status": "SUCCESS",
  "data": {
    "users": [ /* mesmo schema do GET /users */ ],
    "total": 42,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

**Erros**

| Status | Motivo |
|---|---|
| `400` | Query params inválidos |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão ou `companyId` de outra empresa |

---

### `GET /companies/:companyId/users/:id`

Retorna os dados de um usuário específico da empresa.

**Permissão:** `manage-company`

**Path params**

| Param | Tipo | Descrição |
|---|---|---|
| `companyId` | `cuid` | ID da empresa |
| `id` | `uuid` | ID do usuário |

**Response `200`**
```json
{
  "status": "SUCCESS",
  "data": { /* mesmo schema do item acima */ }
}
```

**Erros**

| Status | Motivo |
|---|---|
| `400` | `id` com formato inválido |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão ou `companyId` de outra empresa |
| `404` | Usuário não encontrado ou não pertence à empresa |

---

### `PUT /companies/:companyId/users/:id`

Atualiza dados de um colaborador da empresa. Não permite alterar `role` ou `companyId` — esses campos são exclusivos do admin Zumira via `PUT /users/:id`.

**Permissão:** `manage-company`

**Path params**

| Param | Tipo | Descrição |
|---|---|---|
| `companyId` | `cuid` | ID da empresa |
| `id` | `uuid` | ID do usuário |

**Request body** (todos os campos são opcionais)

```json
{
  "name": "string",
  "customId": "string",
  "occupation": "string",
  "occupationLevel": "string",
  "area": "string",
  "similarExposureGroup": "string",
  "location": "string",
  "skinColor": "string",
  "hasDisability": true,
  "admissionDate": "DD/MM/YYYY",
  "phoneNumber": "11999999999"
}
```

**Response `200`**
```json
{
  "status": "SUCCESS",
  "data": { /* dados atualizados do usuário, mesmo schema do GET */ }
}
```

**Erros**

| Status | Motivo |
|---|---|
| `400` | Body inválido ou `id` com formato inválido |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão ou `companyId` de outra empresa |
| `404` | Usuário não encontrado ou não pertence à empresa |

---

### `DELETE /companies/:companyId/users/:id`

Remove um colaborador da empresa.

**Permissão:** `manage-company`

**Path params**

| Param | Tipo | Descrição |
|---|---|---|
| `companyId` | `cuid` | ID da empresa |
| `id` | `uuid` | ID do usuário |

**Response `200`**
```json
{ "status": "SUCCESS" }
```

**Erros**

| Status | Motivo |
|---|---|
| `400` | `id` com formato inválido |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão ou `companyId` de outra empresa |
| `404` | Usuário não encontrado ou não pertence à empresa |

---

## Endpoints relacionados (já existentes)

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| `POST` | `/companies/users` | `manage-company` | Criar usuário na empresa do requester |
| `POST` | `/companies/users/batch` | `manage-company` | Criar múltiplos usuários |
| `POST` | `/companies/:id/users/sync/preview` | `manage-company` | Preview de sincronização em batch |
| `POST` | `/companies/:id/users/sync/execute` | `manage-company` | Executar sincronização em batch |

> Para criação e sync, o `companyId` é sempre inferido da empresa do requester — não é passado no body.

---

## Notas de segurança

- **Admin-empresa** (`manage-company`, sem `role = "admin"`): o middleware `requireSameCompany` bloqueia qualquer request onde o `companyId` da rota não coincide com a empresa do token. Usuário sem empresa recebe `403` em todos os endpoints.
- **Admin Zumira** (`role = "admin"`): bypass total — pode acessar e modificar usuários de qualquer empresa.
- Os campos `roleId` e `companyId` do usuário **não podem ser alterados** por este CRUD. Use `PUT /users/:id` com permissão `manage-users` para essas operações.
