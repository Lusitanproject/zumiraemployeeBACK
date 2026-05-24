# User Sync API — Contrato

## Payload compartilhado

Ambas as rotas recebem exatamente o mesmo body.

```json
POST /companies/:id/users/sync/preview
POST /companies/:id/users/sync/execute
```

**Path param**

| Campo | Tipo | Obrigatório | Descrição     |
| ----- | ---- | ----------- | ------------- |
| `id`  | cuid | sim         | ID da empresa |

**Body**

```json
{
  "users": [
    {
      "customId": "ext_001",
      "email": "ana@example.com",
      "name": "Ana Silva",
      "phoneNumber": "+5511999999999",
      "occupation": "Analista",
      "occupationLevel": "Pleno",
      "area": "Tecnologia",
      "similarExposureGroup": "TI",
      "location": "São Paulo",
      "skinColor": "Parda",
      "hasDisability": false,
      "birthdate": "1990-05-20",
      "admissionDate": "2022-01-10",
      "gender": "FEMALE",
      "nationalityId": "clxxxxxxxxxxxxxxxx"
    }
  ]
}
```

**Campos do item**

| Campo                  | Tipo    | Obrigatório | Descrição                                   |
| ---------------------- | ------- | ----------- | ------------------------------------------- |
| `customId`             | string  | **sim**     | Chave de reconciliação. Escopo por empresa. |
| `email`                | string  | **sim**     | E-mail único globalmente                    |
| `name`                 | string  | **sim**     | Nome completo                               |
| `phoneNumber`          | string  | não         |                                             |
| `occupation`           | string  | não         |                                             |
| `occupationLevel`      | string  | não         |                                             |
| `area`                 | string  | não         |                                             |
| `similarExposureGroup` | string  | não         |                                             |
| `location`             | string  | não         |                                             |
| `skinColor`            | string  | não         |                                             |
| `hasDisability`        | boolean | não         |                                             |
| `birthdate`            | date    | não         | Formato `YYYY-MM-DD`                        |
| `admissionDate`        | date    | não         | Formato `YYYY-MM-DD`                        |
| `gender`               | enum    | não         | `MALE` \| `FEMALE` \| `OTHER`               |
| `nationalityId`        | cuid    | não         | FK para Nationality                         |

---

## POST /companies/:id/users/sync/preview

Calcula o que aconteceria. **Não persiste nada.**

### Response `200`

```json
{
  "status": "SUCCESS",
  "data": {
    "summary": {
      "received": 3,
      "toCreate": 1,
      "toUpdate": 1,
      "unchanged": 0,
      "conflicts": 1,
      "errors": 0
    },
    "creates": [
      {
        "customId": "ext_002",
        "data": {
          "email": "carlos@example.com",
          "name": "Carlos",
          "occupation": "Dev"
        }
      }
    ],
    "updates": [
      {
        "customId": "ext_001",
        "userId": "usr_abc123",
        "changes": {
          "name": { "from": "Ana Clara", "to": "Ana Silva" },
          "occupation": { "from": null, "to": "Analista" }
        }
      }
    ],
    "unchanged": [],
    "conflicts": [
      {
        "type": "EMAIL_ALREADY_USED",
        "customId": "ext_003",
        "email": "duplicado@example.com",
        "conflictingUserId": "usr_xyz789"
      }
    ],
    "errors": []
  }
}
```

**Campos de `summary`**

| Campo       | Descrição                                   |
| ----------- | ------------------------------------------- |
| `received`  | Total de itens recebidos no payload         |
| `toCreate`  | Itens que seriam criados                    |
| `toUpdate`  | Itens que seriam atualizados                |
| `unchanged` | Itens sem alteração                         |
| `conflicts` | Itens com conflito de identidade no domínio |
| `errors`    | Itens com erro de validação/payload         |

---

## POST /companies/:id/users/sync/execute

Reprocessa o payload do zero com o estado atual do banco e executa as operações. **Não depende do preview** — pode haver drift entre as duas chamadas.

### Response `200`

```json
{
  "status": "SUCCESS",
  "data": {
    "summary": {
      "created": 1,
      "updated": 1,
      "unchanged": 0,
      "failed": 1
    },
    "created": [
      {
        "customId": "ext_002",
        "userId": "usr_new456"
      }
    ],
    "updated": [
      {
        "customId": "ext_001",
        "userId": "usr_abc123"
      }
    ],
    "unchanged": [],
    "failed": [
      {
        "customId": "ext_003",
        "reason": "EMAIL_ALREADY_USED"
      }
    ]
  }
}
```

**Campos de `summary`**

| Campo       | Descrição                                                         |
| ----------- | ----------------------------------------------------------------- |
| `created`   | Usuários criados com sucesso                                      |
| `updated`   | Usuários atualizados com sucesso                                  |
| `unchanged` | Usuários sem alteração (sem operação no banco)                    |
| `failed`    | Itens que falharam (conflitos + erros de validação + erros de DB) |

---

## Conflitos

Problemas de reconciliação de identidade. O sistema não executa automaticamente — item vai para `conflicts` (preview) ou `failed` (execute).

| `type`                       | Quando ocorre                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `CUSTOM_ID_DUPLICATED_IN_DB` | Dois ou mais usuários na empresa possuem o mesmo `customId`                           |
| `EMAIL_ALREADY_USED`         | O e-mail encontrado no banco pertence a um usuário diferente do match pelo `customId` |

## Erros de validação

Problemas no próprio payload. Item vai para `errors` (preview) ou `failed` (execute).

| Situação                             | `field`    | `message`                       |
| ------------------------------------ | ---------- | ------------------------------- |
| `customId` repetido no mesmo payload | `customId` | `customId duplicado no payload` |

---

## Notas

- **Namespace de `customId` por empresa** — duas empresas podem ter o mesmo `customId` sem conflito.
- **Campos não incluídos no payload** são ignorados no diff (sem sobrescrever com `null`).
- **Falhas parciais no execute** — um item falhando não interrompe os demais.
- **Datas** (`birthdate`, `admissionDate`) comparadas por ISO string — re-sincronizar o mesmo valor não gera update falso.
