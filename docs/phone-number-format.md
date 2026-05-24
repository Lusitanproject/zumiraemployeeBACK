# Formato de número de telefone

Os endpoints que aceitam `phoneNumber` usam `PhoneNumberSchema` (`src/schemas/common.ts`), que normaliza qualquer formato válido para **E.164** antes de armazenar (`+5511987654321`).

## Formatos aceitos como input

| Exemplo de input    | País inferido    | Armazenado como    |
| ------------------- | ---------------- | ------------------ |
| `"11987654321"`     | Brasil (default) | `"+5511987654321"` |
| `"(11) 98765-4321"` | Brasil (default) | `"+5511987654321"` |
| `"11 9 8765-4321"`  | Brasil (default) | `"+5511987654321"` |
| `"5511987654321"`   | Brasil (via +55) | `"+5511987654321"` |
| `"+5511987654321"`  | Brasil (E.164)   | `"+5511987654321"` |
| `"+14155552671"`    | EUA              | `"+14155552671"`   |
| `"14155552671"`     | EUA (via +1)     | `"+14155552671"`   |

**Regra de parsing:**

1. Tenta interpretar o input como está, com Brasil como país padrão quando não há código de país.
2. Se falhar, extrai só os dígitos, adiciona `+` na frente e tenta novamente — cobre casos como `"5511987654321"` (código do país sem `+`).

## Formatos rejeitados

Qualquer string que não resulte em número válido após os dois tries retorna erro `400` com a mensagem:

```
Invalid phone number: "<valor enviado>"
```

## Onde é usado

- `POST /users`, `PATCH /users/:id` — campo `phoneNumber`
- `POST /admin/users`, `PATCH /admin/users/:id`
- `GET /admin/users/find-by` — busca por `phoneNumber`
- `POST /sync/:id/users` — campo `phoneNumber` em cada item
