# Contrato — CRUD de Atos (não-admin)

## Visão geral

Endpoints para empresas criarem e gerenciarem seus próprios ACTs. O `company_id` é sempre inferido do token do usuário autenticado — não é passado no body ou na URL.

---

## `POST /acts`

Cria um ACT vinculado à empresa do usuário autenticado.

**Permissão:** `acts-create`

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "string (obrigatório)",
  "description": "string (obrigatório)",
  "icon": "string (obrigatório)",
  "published": "boolean (opcional, default: true)",
  "initialMessage": "string (opcional)",
  "messageInstructions": "string (opcional)",
  "compilationInstructions": "string (opcional)",
  "reportGenerationInstructions": "string (opcional)",
  "reportLookupInstructions": "string (opcional)",
  "individualAnalysisInstructions": "string (opcional)"
}
```

**Response `200`:**

```json
{
  "status": "SUCCESS",
  "data": {
    /* ActChatbot completo */
  }
}
```

---

## `GET /acts/owned`

Lista todos os ACTs cujo `company_id` é o da empresa do usuário.

**Permissão:** `acts-read-owned`

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**

```json
{
  "status": "SUCCESS",
  "data": [
    /* array de ActChatbot */
  ]
}
```

---

## `GET /acts/available`

Lista os ACTs da empresa (owned) **+** os ACTs da trilha à qual a empresa pertence. Sem duplicatas.

**Permissão:** `acts-read-available`

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**

```json
{
  "status": "SUCCESS",
  "data": [
    /* array de ActChatbot */
  ]
}
```

---

## `PUT /acts/:id`

Atualiza um ACT. Só funciona se o ACT pertencer à empresa do usuário (`company_id` bate).

**Permissão:** `acts-update`

**Headers:** `Authorization: Bearer <token>`

**Path param:** `id` — cuid do ACT

**Body:** todos os campos opcionais

```json
{
  "name": "string (opcional)",
  "description": "string (opcional)",
  "icon": "string (opcional)",
  "published": "boolean (opcional)",
  "initialMessage": "string (opcional)",
  "messageInstructions": "string (opcional)",
  "compilationInstructions": "string (opcional)",
  "reportGenerationInstructions": "string (opcional)",
  "reportLookupInstructions": "string (opcional)",
  "individualAnalysisInstructions": "string (opcional)"
}
```

**Response `200`:**

```json
{
  "status": "SUCCESS",
  "data": {
    /* ActChatbot atualizado */
  }
}
```

**Erro se não for dono:**

```json
{ "status": "ERROR", "message": "Ato não encontrado ou sem permissão para alteração" }
```

---

## `DELETE /acts/:id`

Deleta um ACT. Só funciona se o ACT pertencer à empresa do usuário.

**Permissão:** `acts-delete`

**Headers:** `Authorization: Bearer <token>`

**Path param:** `id` — cuid do ACT

**Response `200`:**

```json
{
  "status": "SUCCESS",
  "data": {
    /* ActChatbot deletado */
  }
}
```

**Erro se não for dono:**

```json
{ "status": "ERROR", "message": "Ato não encontrado ou sem permissão para exclusão" }
```

---

## `GET /acts/by-company` ⚠️ Deprecated

Use `GET /acts/available` no lugar.

**Permissão:** `acts-engage`

---

## Respostas de erro comuns

| Situação                      | Status                             |
| ----------------------------- | ---------------------------------- |
| Token ausente ou inválido     | `401 Unauthorized`                 |
| Sem a permissão necessária    | `403 Forbidden`                    |
| Usuário sem empresa associada | `403 Forbidden`                    |
| ACT não pertence à empresa    | Erro `400` com mensagem descritiva |

---

## Novas permissões

| Chave                 | Descrição                                |
| --------------------- | ---------------------------------------- |
| `acts-create`         | Criar ACTs próprios                      |
| `acts-update`         | Atualizar ACTs próprios                  |
| `acts-delete`         | Deletar ACTs próprios                    |
| `acts-read-owned`     | Listar ACTs da empresa                   |
| `acts-read-available` | Listar ACTs disponíveis (owned + trilha) |
