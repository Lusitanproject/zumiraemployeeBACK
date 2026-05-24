# Contract Changes — Validação de email e phone duplicados + sync resiliente

## Contexto

Adicionada validação preventiva de unicidade de `email` e `phoneNumber` em todos os pontos de escrita de usuários. Antes, duplicatas resultavam em erro 500 (`P2002` do Prisma) sem mensagem amigável. Além disso, o sync passou a ser resiliente a phones inválidos (retorna erro por item em vez de 422 global) e os conflitos passaram a incluir mensagem legível.

---

## Endpoints afetados

### POST `/users`

**Serviço:** `UserService.create()`

| Situação                         | Antes       | Depois                                        |
| -------------------------------- | ----------- | --------------------------------------------- |
| `phoneNumber` já existe no banco | 500 (P2002) | **400** `"Número de telefone já está em uso"` |

---

### POST `/companies/:id/users`

**Serviço:** `UserAdminService.create()`

| Situação                         | Antes       | Depois                                        |
| -------------------------------- | ----------- | --------------------------------------------- |
| `email` já existe no banco       | 500 (P2002) | **400** `"E-mail já está em uso"`             |
| `phoneNumber` já existe no banco | 500 (P2002) | **400** `"Número de telefone já está em uso"` |

---

### POST `/companies/:id/users/batch` · POST `/admin/users/batch`

**Serviço:** `UserAdminService.createMany()`

| Situação                          | Antes       | Depois                                                 |
| --------------------------------- | ----------- | ------------------------------------------------------ |
| Emails duplicados dentro do batch | 500 (P2002) | **400** `"E-mails duplicados no batch"`                |
| Phones duplicados dentro do batch | 500 (P2002) | **400** `"Números de telefone duplicados no batch"`    |
| `email` já existe no banco        | 500 (P2002) | **400** `"E-mail já está em uso: <email>"`             |
| `phoneNumber` já existe no banco  | 500 (P2002) | **400** `"Número de telefone já está em uso: <phone>"` |

---

### PATCH `/users/:id` · PATCH `/companies/:id/users/:userId`

**Serviço:** `UserService.update()`

| Situação                                  | Antes             | Depois                                        |
| ----------------------------------------- | ----------------- | --------------------------------------------- |
| `phoneNumber` pertence a outro usuário    | 500 (P2002)       | **400** `"Número de telefone já está em uso"` |
| `phoneNumber` igual ao do próprio usuário | 200 (sem mudança) | 200 (sem falso positivo) ✓                    |

> Email não é campo atualizável via `UpdateUserSchema` — sem alteração nesse endpoint.

---

### POST `/companies/:id/sync/preview` · POST `/companies/:id/sync/execute`

**Serviço:** `UserService.planSync()` → `executeSync()`

#### Novo tipo de conflito

```diff
- type ConflictType = "CUSTOM_ID_DUPLICATED_IN_DB" | "EMAIL_ALREADY_USED"
+ type ConflictType = "CUSTOM_ID_DUPLICATED_IN_DB" | "EMAIL_ALREADY_USED" | "PHONE_ALREADY_USED"
```

#### Campo `message` adicionado a cada conflito

Todos os conflitos agora incluem um campo `message` com texto legível. Antes apenas `type` era retornado.

```diff
  {
    "type": "EMAIL_ALREADY_USED",
    "customId": "ABC123",
    "email": "joao@empresa.com",
    "conflictingUserId": "clx...",
+   "message": "E-mail \"joao@empresa.com\" já está em uso por João Silva"
  }
```

| Tipo                         | Mensagem                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| `CUSTOM_ID_DUPLICATED_IN_DB` | `ID externo "<id>" está duplicado no banco (N registros encontrados)` |
| `EMAIL_ALREADY_USED`         | `E-mail "<email>" já está em uso por <nome>`                          |
| `PHONE_ALREADY_USED`         | `Número "<phone>" já está em uso por <nome>`                          |

#### Phone inválido no payload

O `phoneNumber` do `SyncUserItemSchema` deixou de usar `PhoneNumberSchema` — aceita qualquer string. A validação e normalização acontece dentro do `planSync`.

| Situação                                             | Antes                                     | Depois                                                             |
| ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Phone inválido em qualquer item                      | **422** global, request inteiro rejeitado | **200**, item vai para `errors[]` com `field: "phoneNumber"`       |
| Phone válido em formato não-E.164                    | **422**                                   | **200**, normalizado para E.164 automaticamente                    |
| `phoneNumber` do payload já pertence a outro usuário | DB error → `failed[]` genérico            | `conflicts[]` com `type: "PHONE_ALREADY_USED"` e `message` legível |
