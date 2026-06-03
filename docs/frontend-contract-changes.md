# Mudanças de Contrato — ACTs / Trails

> **Branch:** `dev` · **Data:** 2026-06-02  
> Este documento descreve todas as alterações de API necessárias para a migração do frontend após o desacoplamento de `ActChatbot` de `Trail` e a criação de `UserTrailProgress`.

---

## Resumo executivo — o que quebra

- `GET /acts` **removido** → usar `GET /trails/:trailId/acts`
- `GET /acts/full-story` **removido** → usar `GET /trails/:trailId/full-story`
- `PUT /acts/next` **removido** → usar `PUT /trails/:trailId/next`
- **Novo endpoint:** `GET /companies/trail` — obter o `trailId` da empresa do usuário (necessário para chamar as rotas acima)
- `POST /admin/acts` — campo `trailId` **removido** do body
- `PUT /admin/acts/:id` — campos `trailId` e `index` **removidos** do body
- `PUT /admin/acts/update-many` — campos `trailId` e `index` **removidos** de cada item
- `GET /admin/acts` e `GET /admin/acts/:id` — campos `trailId` e `index` **removidos** da resposta
- **Novo endpoint admin:** `PUT /admin/trails/:trailId/acts` — gerencia a associação ato↔trilha
- Login: campos `name`, `gender`, `act`, `role` **removidos da raiz** — tudo está dentro de `user`; resposta agora é `{ token, expiresAt, user }`

---

## 1. Novo endpoint: `GET /companies/trail`

Retorna a trilha da empresa do usuário autenticado. Use o `id` retornado como `trailId` em todas as chamadas a `/trails/*`.

**Request:**

```http
GET /companies/trail
Authorization: Bearer <token>
```

**Resposta:**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "cuid-da-trilha",
    "title": "Título da trilha",
    "subtitle": "Subtítulo",
    "description": "Descrição"
  }
}
```

**Fluxo recomendado no front:**

1. Chamar `GET /companies/trail` após login (ou sempre que precisar do `trailId`).
2. Guardar o `data.id` como `trailId`.
3. Usar esse `trailId` em `GET /trails/:trailId/acts`, `GET /trails/:trailId/full-story` e `PUT /trails/:trailId/next`.

---

## 2. Endpoints renomeados (URL + parâmetro `trailId` obrigatório)

### `GET /acts` → `GET /trails/:trailId/acts`

URL renomeada; `trailId` como path param.

**Resposta (inalterada):**

```json
{
  "status": "SUCCESS",
  "data": {
    "chatbots": [
      {
        "id": "cuid",
        "name": "Nome",
        "description": "...",
        "icon": "icon-key",
        "index": 0,
        "locked": false,
        "current": true
      },
      {
        "id": "cuid",
        "name": "Nome",
        "description": "...",
        "icon": "icon-key",
        "index": 1,
        "locked": true,
        "current": false
      }
    ],
    "chapters": [{ "id": "cuid", "title": "Título", "actChatbotId": "cuid", "createdAt": "...", "updatedAt": "..." }],
    "progress": 0.5
  }
}
```

> `index`, `locked` e `current` continuam presentes. `index` agora vem da tabela de associação (não do model `ActChatbot`), mas o valor e significado são os mesmos.

---

### `GET /acts/full-story` → `GET /trails/:trailId/full-story`

URL renomeada; `trailId` como path param.

**Resposta — mudança no campo `actChatbot.index`:**

Antes:

```json
{ "chapters": [{ "actChatbot": { "name": "Nome", "index": 0 } }] }
```

Depois (shape igual, mas `index` agora vem da associação trilha↔ato):

```json
{ "chapters": [{ "actChatbot": { "name": "Nome", "index": 0 } }] }
```

> Ordem dos capítulos: passa a ser por `createdAt` do capítulo (antes ordenava implicitamente por index do ato). Para atos criados em ordem cronológica o resultado é o mesmo.

---

### `PUT /acts/next` → `PUT /trails/:trailId/next`

URL renomeada; `trailId` como path param. Body não precisa mais de `trailId`.

**Resposta (inalterada):**

```json
{ "status": "SUCCESS", "data": { "currActChatbotId": "cuid" } }
```

---

## 3. Endpoints admin de ACTs — mudanças de contrato

### `POST /admin/acts` — campo `trailId` removido

Antes:

```json
{ "name": "Nome", "description": "...", "icon": "icon", "trailId": "cuid" }
```

Depois (`trailId` não existe mais — ato criado solto, sem trilha):

```json
{ "name": "Nome", "description": "...", "icon": "icon" }
```

> Para associar o ato a uma trilha, use `PUT /admin/trails/:trailId/acts` após criar o ato.

---

### `PUT /admin/acts/:id` — campos `trailId` e `index` removidos

Antes:

```json
{ "name": "Nome atualizado", "trailId": "cuid", "index": 2 }
```

Depois:

```json
{ "name": "Nome atualizado" }
```

> Para reordenar ou mover o ato entre trilhas, use `PUT /admin/trails/:trailId/acts`.

---

### `PUT /admin/acts/update-many` — `trailId` e `index` removidos de cada item

Antes:

```json
{
  "chatbots": [
    { "id": "cuid", "index": 0, "trailId": "cuid" },
    { "id": "cuid", "index": 1, "trailId": "cuid" }
  ]
}
```

Depois (endpoint serve apenas para editar campos do ato, não reordenação):

```json
{ "chatbots": [{ "id": "cuid", "name": "Novo nome" }] }
```

---

### `GET /admin/acts` — `trailId` e `index` removidos da resposta

Antes:

```json
{ "items": [{ "id": "cuid", "name": "...", "trailId": "cuid", "index": 0, "createdAt": "..." }] }
```

Depois:

```json
{ "items": [{ "id": "cuid", "name": "...", "createdAt": "..." }] }
```

> A lista global de atos não tem mais contexto de trilha. Use `GET /admin/acts/by-trail?trailId=` para obter atos com `index`.

---

### `GET /admin/acts/:id` — `trailId` e `index` removidos da resposta

Antes:

```json
{ "id": "cuid", "name": "...", "trailId": "cuid", "index": 0, "initialMessage": "...", "createdAt": "..." }
```

Depois:

```json
{ "id": "cuid", "name": "...", "initialMessage": "...", "createdAt": "..." }
```

---

### `GET /admin/acts/by-trail?trailId=` — **compatível** (shape preservado)

Resposta continua incluindo `index` (vem da tabela de associação):

```json
{ "items": [{ "id": "cuid", "name": "...", "index": 0, "createdAt": "..." }] }
```

---

## 4. Novo endpoint admin: `PUT /admin/trails/:trailId/acts`

Define (substitui completamente) os atos associados a uma trilha e sua ordem.

**Request:**

```http
PUT /admin/trails/{trailId}/acts
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "acts": [
    { "actChatbotId": "cuid-do-ato-a", "index": 0 },
    { "actChatbotId": "cuid-do-ato-b", "index": 1 },
    { "actChatbotId": "cuid-do-ato-c", "index": 2 }
  ]
}
```

- Os `index` enviados são renormalizados para 0..n-1 (preservando a ordem relativa).
- Enviar `acts: []` remove todos os atos da trilha.
- Progressos de usuários cujo ato atual foi removido são recalculados automaticamente: o usuário avança para o próximo ato disponível; se não houver, para o anterior.

**Resposta:**

```json
{ "status": "SUCCESS" }
```

**Permissão:** `admin-trails-manage`

---

## 5. Autenticação — resposta de login simplificada

Os campos legados `name`, `gender`, `act` e `role` foram **removidos da raiz** da resposta. A resposta agora contém apenas `token`, `expiresAt` e `user`.

**Antes:**

```json
{
  "name": "...",
  "gender": "...",
  "act": "cuid-do-ato-atual",
  "role": "user",
  "token": "...",
  "expiresAt": "...",
  "user": { ... }
}
```

**Depois:**

```json
{
  "token": "...",
  "expiresAt": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "gender": "...",
    "role": { "id": "...", "slug": "user", ... },
    "companyId": "...",
    ...
  }
}
```

> Todos os dados do usuário estão dentro de `user`. Leia `user.name`, `user.role.slug`, etc. O ato atual é obtido via `GET /trails/:trailId/acts` (campo `current: true` em cada chatbot).

---

## 6. Schema `User` — campo removido

O campo `currentActChatbotId` foi removido do model `User` e de todos os responses que incluem o objeto `user`. Se o frontend ler `user.currentActChatbotId` de qualquer response, esse campo não existirá mais.

**Onde obter o ato atual:** `GET /trails/acts` → `chatbots.find(b => b.current === true)`.
