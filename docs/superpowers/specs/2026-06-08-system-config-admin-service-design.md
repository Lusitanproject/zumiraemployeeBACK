# System Config Admin Service — Design Spec

**Date:** 2026-06-08  
**Status:** Approved

## Context

O modelo `SystemConfig` já existe no Prisma como singleton (id sempre = 1) com o campo `reportUnavailableInstructions String?`. Este service expõe endpoints admin para ler e atualizar essa configuração global do sistema, seguindo o padrão de todos os outros recursos admin do projeto.

## Endpoints

| Method | Path                   | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| GET    | `/admin/system-config` | Retorna a configuração atual             |
| PUT    | `/admin/system-config` | Atualiza `reportUnavailableInstructions` |

Ambos protegidos por `isAuthenticated + requirePermissions("admin-system-config-manage")`.

## Architecture

Segue o padrão completo existente (ex: CompanyAdmin):

```
Schema (Zod validation)
  └── Controller (parse input → call service → return response)
        └── Service (Prisma operations)
```

## Files

### Create

**`src/schemas/admin/system-config.ts`**

```ts
import { z } from "zod";

export const UpdateSystemConfigSchema = z.object({
  reportUnavailableInstructions: z.string(),
});

export type UpdateSystemConfigRequest = z.infer<typeof UpdateSystemConfigSchema>;
```

**`prisma/schema.prisma`** — alterar o campo:

```prisma
reportUnavailableInstructions String @default("")
```

**`src/services/admin/SystemConfigAdminService.ts`**

- `getConfig()`: `prisma.systemConfig.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } })` — garante retorno mesmo se não existir (campo terá default `""`)
- `update(data)`: `prisma.systemConfig.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } })`

**`src/controllers/admin/system-config/GetSystemConfigController.ts`**

- Chama `SystemConfigAdminService.getConfig()`
- Retorna `{ status: "SUCCESS", data: config }`

**`src/controllers/admin/system-config/UpdateSystemConfigController.ts`**

- Parseia `req.body` com `UpdateSystemConfigSchema`
- Chama `SystemConfigAdminService.update(data)`
- Retorna `{ status: "SUCCESS", data: updated }`

**`src/routes/admin/system-config.routes.ts`**

- `GET /` → `isAuthenticated` → `requirePermissions("admin-system-config-manage")` → `GetSystemConfigController`
- `PUT /` → `isAuthenticated` → `requirePermissions("admin-system-config-manage")` → `UpdateSystemConfigController`
- Swagger JSDoc para ambos os endpoints

### Modify

**`src/routes/admin/index.ts`**

- Adicionar: `adminRouter.use("/system-config", adminSystemConfigRouter)`

**`src/config/swagger.ts`**

- Adicionar rota do arquivo no array `apis`

## Data Flow

```
GET /admin/system-config
  → GetSystemConfigController.handle
    → SystemConfigAdminService.getConfig()
      → prisma.systemConfig.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } })
    ← SystemConfig { id: 1, reportUnavailableInstructions: string | null }
  ← { status: "SUCCESS", data: { ... } }

PUT /admin/system-config
  → UpdateSystemConfigController.handle
    → UpdateSystemConfigSchema.parse(req.body)  [422 se inválido]
    → SystemConfigAdminService.update(data)
      → prisma.systemConfig.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } })
    ← SystemConfig atualizado
  ← { status: "SUCCESS", data: { ... } }
```

## Error Handling

- Validação Zod → middleware `errorHandler` captura `ZodError` → 422
- Erros inesperados → 500 via `errorHandler`
- Nenhum `PublicError` esperado (operação simples sem regras de negócio)

## Prisma Migration

Após alterar o schema, rodar `npx prisma migrate dev --create-only` para gerar a migration que adiciona `DEFAULT ''` à coluna `report_unavailable_instructions`.

## Verification

1. `npx tsc --noEmit` — sem erros de tipo
2. `GET /admin/system-config` com token válido + permissão → retorna `{ status: "SUCCESS", data: { id: 1, reportUnavailableInstructions: null } }`
3. `PUT /admin/system-config` com `{ reportUnavailableInstructions: "texto" }` → retorna config atualizado
4. `PUT /admin/system-config` com body inválido → 422
5. `GET /admin/system-config` sem token → 401
