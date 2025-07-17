# Documentação Frontend - Zumira Saúde Mental

## Visão Geral

O frontend da aplicação Zumira é desenvolvido em **Next.js 15** com **TypeScript** e segue uma arquitetura focada em **Server Components** e **Server Actions** para máxima performance e SEO. A aplicação utiliza **TailwindCSS** para estilização e **Radix UI** para componentes base.

A aplicação possui uma **área administrativa** completa que permite a administração do conteúdo ofertado pela plataforma e configurações gerais do sistema.

## Arquitetura e Padrões

### Priorização de Server Components e Server Actions

O projeto prioriza o uso de:

- **Server Components**: Para renderização no servidor, melhor performance e SEO
- **Server Actions**: Para operações que requerem acesso ao backend, mantendo a lógica sensível no servidor
- **Client Components**: Apenas quando necessário para interatividade (formulários, estados, eventos)

```typescript
// ✅ Exemplo de Server Component
export default async function UsersPage() {
  const users = await getUsers(); // Server Action

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// ✅ Exemplo de Server Action
("use server");
export async function getUsers(): Promise<User[]> {
  // Lógica de chamada à API
}
```

### Estrutura de Pastas Next.js App Router

O projeto segue a estrutura padrão do Next.js 15 com App Router:

```
src/
├── app/                        # App Router (Next.js 15)
│   ├── (auth)/                # Grupo de rotas autenticadas
│   │   ├── admin/             # Área administrativa
│   │   ├── autoconhecimento/  # Módulo de autoconhecimento
│   │   ├── chat/              # Chat com assistente
│   │   └── layout.tsx         # Layout para rotas autenticadas
│   ├── (public)/              # Grupo de rotas públicas
│   │   ├── entrar/            # Login
│   │   ├── registrar/         # Cadastro
│   │   └── layout.tsx         # Layout para rotas públicas
│   ├── layout.tsx             # Layout raiz
│   └── page.tsx               # Landing page
├── api/                       # Camada de API (nova estrutura)
├── components/                # Componentes reutilizáveis
├── types/                     # Tipos TypeScript centralizados
└── utils/                     # Utilitários
```

## Arquitetura de API Centralizada

### Padrão Atual

O projeto adotou uma arquitetura centralizada que substitui os arquivos `definitions.ts` e `actions.ts` locais de cada rota. Esta mudança elimina redundância de código e centraliza toda lógica de API.

**⚠️ Importante**: Nem todo o código foi convertido para este padrão, mas novos desenvolvimentos devem seguir essa estrutura.

#### Estrutura Atual

```
src/
├── api/                    # 🆕 API centralizada
│   ├── common.ts          # Tipos base (ZumiraApiResponse)
│   ├── users.ts           # Funções relacionadas a usuários
│   ├── assessments.ts     # Funções relacionadas a avaliações
│   ├── notifications.ts   # Funções relacionadas a notificações
│   └── ...
└── types/                 # 🆕 Tipos centralizados
    ├── user.ts           # Tipos de usuário
    ├── assessment.ts     # Tipos de avaliação
    └── ...
```

### Padrão de Organização

#### Estrutura de Arquivo API

```typescript
// src/api/users.ts
import { ZumiraApiResponse } from "./common";
import { User } from "@/types/user";

// Tipos de Request e Response
export interface CreateUserRequest {
  name: string;
  email: string;
}

export type GetUsersResponse = ZumiraApiResponse<{ users: User[] }>;

// Funções de API
export async function getUsers(): Promise<User[]> {
  // Implementação
}
```

#### Tipo Base Padronizado

```typescript
// src/api/common.ts
export type ZumiraApiResponse<T> = { status: "SUCCESS"; data: T } | { status: "ERROR"; message: string };
```

#### Tipos Centralizados

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}
```

### Comparação de Abordagens

```typescript
// ❌ Abordagem descentralizada (ainda existe no código)
// app/(auth)/users/definitions.ts
export interface User {
  /* ... */
}

// app/(auth)/users/actions.ts
export async function getUsers() {
  /* ... */
}

// ✅ Padrão atual (deve ser usado)
// src/types/user.ts
export interface User {
  /* ... */
}

// src/api/users.ts
export async function getUsers(): Promise<User[]> {
  /* ... */
}

// app/(auth)/users/page.tsx
import { getUsers } from "@/api/users";
```

## Segurança e Variáveis de Ambiente

### ⚠️ CUIDADO com NEXT_PUBLIC

**ATENÇÃO**: Variáveis com prefixo `NEXT_PUBLIC_` são expostas ao cliente!

```typescript
// ❌ NUNCA faça isso com dados sensíveis
NEXT_PUBLIC_API_SECRET=secret123  // ❌ Exposto ao cliente!

// ✅ Correto para dados não sensíveis
NEXT_PUBLIC_APP_NAME=Zumira       // ✅ Seguro para o cliente

// ✅ Dados sensíveis apenas no servidor
API_SECRET=secret123              // ✅ Apenas no servidor
DATABASE_URL=postgresql://...     // ✅ Apenas no servidor
```

### Boas Práticas de Segurança

1. **Server Actions para dados sensíveis**:

```typescript
"use server";
export async function sensitiveOperation() {
  const secret = process.env.API_SECRET; // ✅ Seguro no servidor
  // Lógica sensível
}
```

2. **Validação de entrada**:

```typescript
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function createUser(formData: FormData) {
  const parsed = UserSchema.parse({
    email: formData.get("email"),
    name: formData.get("name"),
  });
  // Usar dados validados
}
```

## Componentes e Padrões de UI

### Estrutura de Componentes

```
components/
├── ui/                    # Componentes base (Radix + styled)
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── custom/                # Componentes específicos da aplicação
│   ├── header.tsx
│   ├── sidebar/
│   └── notifications/
└── landing-page/          # Componentes da landing page
    ├── sections/
    └── layout/
```

### Padrão de Componentes

```typescript
// Componente Server (padrão)
interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="border rounded p-4">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Componente Client (quando necessário)
"use client";

interface InteractiveCardProps {
  initialData: User;
}

export function InteractiveCard({ initialData }: InteractiveCardProps) {
  const [data, setData] = useState(initialData);

  return (
    <div onClick={() => setData(...)}>
      {/* Conteúdo interativo */}
    </div>
  );
}
```

## Padrões de Formulários

### Server Actions para Formulários

```typescript
// actions.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function createUser(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Criar usuário
  const user = await createUserAPI(validatedFields.data);

  if (user) {
    redirect("/users");
  }

  return { error: "Erro ao criar usuário" };
}
```

### Hook useActionState

```typescript
"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

export function UserForm() {
  const [state, formAction, pending] = useActionState(createUser, undefined);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}

      <input name="name" type="text" required />
      {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar Usuário"}
      </button>
    </form>
  );
}
```

## Autenticação e Autorização

### Middleware de Autenticação

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/_lib/session";

export async function middleware(request: NextRequest) {
  const session = await decrypt(request.cookies.get("session")?.value);

  if (!session && request.nextUrl.pathname.startsWith("/(auth)")) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  return NextResponse.next();
}
```

### Proteção de Rotas

```typescript
// Layout com verificação de autenticação
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/entrar");
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Tratamento de Erros

### Utility para Catch de Erros

```typescript
// src/utils/error.ts
export async function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise.then((data) => [undefined, data] as [undefined, T]).catch((error) => [error]);
}

// Uso
const [error, users] = await catchError(getUsers());
if (error) {
  // Tratar erro
  return [];
}
// Usar users com segurança
```

### Error Boundaries

```typescript
// app/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="error-container">
      <h2>Algo deu errado!</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

## Estilização

### TailwindCSS + Design System

O projeto utiliza TailwindCSS com configuração customizada:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        "zumira-green": "#your-green",
        background: {
          0: "#ffffff",
          300: "#f5f5f5",
        },
        text: {
          400: "#666666",
          500: "#333333",
          700: "#000000",
        },
      },
    },
  },
};
```

### Utility para Classes Condicionais

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso
<div className={cn("base-classes", condition && "conditional-classes", className)} />;
```

## Deploy e Build

### Scripts de Build

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Variáveis de Ambiente por Ambiente

```bash
# .env.local (desenvolvimento)
API_BASE_URL=http://localhost:3333
NEXT_PUBLIC_APP_ENV=development

# .env.production (produção)
API_BASE_URL=https://api.zumira.com
NEXT_PUBLIC_APP_ENV=production
```

## Deploy e Hospedagem

O projeto é hospedado na **Vercel**.

## Status da Implementação

### ✅ Implementado

- Estrutura `/api` e `/types` estabelecida
- Tipo `ZumiraApiResponse<T>` padronizado
- Arquivos centralizados: `users.ts`, `assessments.ts`, `acts.ts`, etc.
- Tipos centralizados: `user.ts`, `assessment.ts`, `act.ts`, etc.

### ⚠️ Pendente

- Conversão completa dos arquivos `definitions.ts` e `actions.ts` locais remanescentes
- Refatoração de componentes que ainda usam a abordagem descentralizada

**Novos desenvolvimentos devem seguir o padrão centralizado.**

## Checklist para Novos Desenvolvimentos

- [ ] Usar Server Components quando possível
- [ ] Centralizar chamadas de API em `/api`
- [ ] Definir tipos em `/types`
- [ ] Usar `ZumiraApiResponse<T>` para respostas
- [ ] Evitar `NEXT_PUBLIC_` para dados sensíveis

---

_Esta documentação reflete o padrão atual do projeto. Nem todo código foi convertido, mas novos desenvolvimentos devem seguir estas diretrizes._
