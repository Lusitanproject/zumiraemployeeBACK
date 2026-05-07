# API — Roles & Permissions

Todos os endpoints exigem header `Authorization: Bearer <token>`.

---

## Roles

### Listar roles
```
GET /roles
```
**Response 200**
```json
{
  "status": "SUCCESS",
  "data": {
    "roles": [
      { "id": "uuid", "slug": "admin", "createdAt": "iso", "updatedAt": "iso" }
    ]
  }
}
```

---

### Criar role
```
POST /roles/admin
```
**Body**
```json
{ "slug": "string" }
```
**Response 200**
```json
{
  "status": "SUCCESS",
  "data": { "id": "uuid", "slug": "admin", "createdAt": "iso", "updatedAt": "iso" }
}
```
**Erros**
- `400` — slug já existe

---

### Editar role
```
PUT /roles/admin/:id
```
**Body**
```json
{ "slug": "string" }
```
**Response 200**
```json
{
  "status": "SUCCESS",
  "data": { "id": "uuid", "slug": "novo-slug", "createdAt": "iso", "updatedAt": "iso" }
}
```
**Erros**
- `400` — slug já existe em outro perfil

---

### Deletar role
```
DELETE /roles/admin/:id
```
**Response 200**
```json
{ "status": "SUCCESS" }
```

---

### Definir permissões de uma role
Substitui **toda** a lista de permissões da role pelo conjunto enviado.
Enviar `permissions: []` remove todas as permissões.
Os slugs devem ser valores válidos retornados por `GET /permissions/admin`.

```
PUT /roles/admin/:id/permissions
```
**Body**
```json
{ "permissions": ["manage-roles", "manage-users"] }
```
**Response 200**
```json
{ "status": "SUCCESS" }
```
**Erros**
- `400` — role não encontrada
- `400` — um ou mais slugs inválidos

---

## Permissions

### Listar permissões disponíveis
Retorna os slugs definidos em código. Não há endpoint de criação — novas permissões são adicionadas via código.

```
GET /permissions/admin
```
**Response 200**
```json
{
  "status": "SUCCESS",
  "data": {
    "permissions": [
      "answer-assessment",
      "read-assessment",
      "manage-question",
      "manage-dimension",
      "manage-users",
      "manage-roles",
      "manage-company"
    ]
  }
}
```
