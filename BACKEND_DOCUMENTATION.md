# Documentação do Backend - Zumira Saúde Mental

## Índice

1. [Arquitetura Geral](#arquitetura-geral)
2. [Infraestrutura e Deployment](#infraestrutura-e-deployment)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Padrões de Código](#padrões-de-código)
5. [Organização dos Serviços](#organização-dos-serviços)
6. [Controllers](#controllers)
7. [Tipagem e Schemas](#tipagem-e-schemas)
8. [Rotas](#rotas)
9. [Melhorias Identificadas](#melhorias-identificadas)
10. [Cuidados com Migrations](#cuidados-com-migrations)

## Arquitetura Geral

O backend segue uma arquitetura em camadas com separação clara de responsabilidades:

```
├── controllers/     # Camada de apresentação (entrada HTTP)
├── services/        # Camada de negócio
├── definitions/     # Schemas e tipos TypeScript
├── routes/          # Definição das rotas
├── middlewares/     # Middlewares da aplicação
├── prisma/          # ORM e schema do banco
├── config/          # Configurações
└── utils/           # Utilitários
```

## Infraestrutura e Deployment

### Hospedagem

- **Backend**: Deployado na **Vercel**
- **Banco de Dados**: Hospedado na **Neon** (PostgreSQL serverless)

### Ambientes

O projeto possui múltiplos ambientes com bancos de dados separados na **Neon**:

- **DEV**: Ambiente de desenvolvimento
- **QA**: Ambiente de testes/qualidade
- **Produção**: Ambiente de produção

### Infraestrutura por Ambiente

- **Plataforma**: Vercel para hospedagem do backend (todos os ambientes)
- **Database**: Neon PostgreSQL com bancos separados para DEV, QA e Produção
- **ORM**: Prisma para gerenciamento do banco de dados

### Considerações Importantes

- **Migrations**: Como existem bancos em múltiplos ambientes na Neon (DEV, QA, Produção), migrations devem ser aplicadas com extremo cuidado
- **Deploy**: O backend na Vercel recebe atualizações automaticamente via Git para cada ambiente
- **⚠️ REDEPLOYS VERCEL**: **SEMPRE fazer redeploys manuais na Vercel especificando a branch correta para cada ambiente**. NUNCA fazer redeploy automático ou de branch incorreta, pois isso executará migrations de outras branches no ambiente, **muito provavelmente quebrando tudo**
- **Monitoramento**: Verificar logs tanto na Vercel quanto na Neon em caso de problemas
- **Gestão de Ambientes**: Sempre testar primeiro em DEV, depois QA, antes de aplicar em Produção

## Estrutura de Pastas

### Controllers

Cada controller tem sua própria file e é responsável por:

- Receber requisições HTTP
- Validar dados de entrada
- Chamar o serviço apropriado
- Retornar a resposta formatada

```
controllers/
├── act/
├── admin/
├── alert/
├── assessment/
├── company/
├── nationality/
├── notification/
├── psychological-dimension/
├── self-monitoring-block/
└── user/
```

### Services

Cada serviço tem sua própria file e contém a lógica de negócio:

```
services/
├── act/
├── admin/           # Classes específicas para admin por tabela
├── alert/
├── assessment/
├── company/
├── nationality/
├── notification/
├── psychological-dimension/
├── self-monitoring-block/
└── user/
```

**Exceção:** Os serviços de admin devem ter uma classe respectiva correspondendo à sua tabela no banco de dados.

### Definitions

Centraliza toda a tipagem das requisições:

```
definitions/
├── admin/           # Schemas específicos de admin
├── actChatbot.ts
├── alert.ts
├── assessment.ts
├── common.ts
├── company.ts
├── notification.ts
├── selfMonitoringBlock.ts
└── user.ts
```

## Padrões de Código

### Nomenclatura de Arquivos

- **Controllers**: `<NomeDoController>Controller.ts`
- **Services Regulares**: `<NomeDoService>Service.ts` (um arquivo por funcionalidade)
- **Services Admin**: `<NomeDoAdmin>AdminService.ts` (um arquivo por tabela com múltiplos métodos)
- **Schemas**: `<NomeDoServico>.ts` em `/definitions`

### Nomenclatura de Classes

- **Controllers**: `<NomeDoController>Controller`
- **Services Regulares**: `<NomeDoService>Service` com método `execute()`
- **Services Admin**: `<NomeDoAdmin>AdminService` com métodos `find()`, `create()`, `update()`, etc.

### Estrutura dos Services

#### Services Regulares

- **Uma file por funcionalidade específica**
- **Apenas uma função async `execute()`**
- Responsável por uma única operação de negócio

```typescript
class CreateUserService {
  async execute(data: CreateUserRequest): Promise<User> {
    // Lógica específica para criar usuário
  }
}

class SendEmailService {
  async execute(emailData: EmailRequest): Promise<void> {
    // Lógica específica para enviar email
  }
}
```

#### Services Admin

- **Uma file por tabela do banco de dados**
- **Múltiplos métodos para operações CRUD**
- Centraliza todas as operações administrativas de uma entidade

```typescript
class UserAdminService {
  async find(id: string) {
    /* buscar por ID */
  }
  async findAll() {
    /* listar todos */
  }
  async create(data: CreateUserRequest) {
    /* criar */
  }
  async update(id: string, data: UpdateUserRequest) {
    /* atualizar */
  }
  async delete(id: string) {
    /* deletar */
  }
}
```

## Organização dos Serviços

### Serviços Regulares

**Cada serviço tem sua própria file com apenas uma função async `execute`**. Cada funcionalidade específica possui seu próprio serviço:

```typescript
// Exemplo: CreateUserService
export class CreateUserService {
  async execute(data: CreateUserRequest): Promise<User> {
    // Lógica de criação de usuário
    const user = await prismaClient.user.create({ data });
    return user;
  }
}

// Exemplo: ListSelfMonitoringBlocksService
export class ListSelfMonitoringBlocksService {
  async execute() {
    // Lógica para listar blocos de automonitoramento
    const blocks = await prismaClient.selfMonitoringBlock.findMany();
    return { blocks };
  }
}
```

### Serviços Admin

**Os serviços de admin são uma exceção** e devem ter uma classe respectiva correspondendo à sua tabela no banco de dados, **com uma file para todos os serviços de uma tabela**:

```typescript
// Exemplo: UserAdminService - Uma classe para todas as operações de admin em usuários
export class UserAdminService {
  async find(id: string): Promise<User | null> {
    // Buscar usuário específico
  }

  async findAll(): Promise<User[]> {
    // Listar todos os usuários
  }

  async create(data: CreateUserRequest): Promise<User> {
    // Criar usuário
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    // Atualizar usuário
  }

  async delete(id: string): Promise<void> {
    // Deletar usuário
  }
}
```

## Controllers

Cada controller tem sua própria file e segue o padrão:

### Padrão de Resposta da API

**Todas as respostas da API seguem um padrão consistente:**

```typescript
// Resposta de sucesso
{
  status: "SUCCESS",
  data: any // Dados retornados pela operação
}

// Resposta de erro
{
  status: "ERROR",
  message: string // Mensagem de erro
}
```

### Tratamento de Erros

**Os erros são tratados automaticamente e retornam no formato padrão da API:**

- **PublicError**: Para erros que devem retornar uma mensagem explicativa para o cliente
  - Retorna status HTTP **400** (Bad Request)
  - A mensagem é exibida diretamente ao usuário
- **Outros Erros**: Para erros internos/inesperados
  - Retorna status HTTP **500** (Internal Server Error)
  - Mensagem genérica "Erro interno" é retornada ao cliente
  - O erro real é logado no servidor

```typescript
import { PublicError } from "../error";

// Exemplo de uso do PublicError
if (!user) {
  throw new PublicError("Usuário não encontrado"); // Retorna 400
}

// Outros erros automaticamente viram 500
throw new Error("Erro de conexão com banco"); // Retorna 500 com "Erro interno"
```

### Estrutura dos Controllers

```typescript
export class ExampleController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos dados
      const validatedData = ExampleSchema.parse(req.body);

      // Chamada do serviço - sempre usa o método execute() para services regulares
      const service = new ExampleService();
      const result = await service.execute(validatedData);

      return res.json({ status: "SUCCESS", data: result });
    } catch (error) {
      // O tratamento de erro é automático via middleware
      // PublicError -> 400 com mensagem do erro
      // Outros erros -> 500 com "Erro interno"
      throw error; // Middleware trata automaticamente
    }
  }
}

// Para services admin, usa métodos específicos (find, create, update, etc.)
export class AdminExampleController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = AdminExampleSchema.parse(req.body);

      const service = new ExampleAdminService();
      const result = await service.create(validatedData); // ou find, update, delete

      return res.json({ status: "SUCCESS", data: result });
    } catch (error) {
      // Tratamento automático de erros
      throw error;
    }
  }
}
```

**Nota**: O tratamento de erros é feito automaticamente por um middleware global que captura todos os erros e os formata no padrão da API.

## Tipagem e Schemas

### Estrutura dos Definitions

As tipagens das requisições devem ficar centralizadas em `/definitions`:

```typescript
// exemplo: assessment.ts
import { z } from "zod";

// Schema Zod
export const CreateAssessmentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  companyId: z.string(),
});

// Interface para o serviço
export type CreateAssessmentRequest = z.infer<typeof CreateAssessmentSchema>;

// Para requests que recebem atributos além dos schemas
export type CreateAssessmentWithUserRequest = CreateAssessmentRequest & {
  userId: string;
  createdAt: Date;
};
```

### Padrão de Nomenclatura

- **Schemas Zod**: `<NomeDoServico>Schema`
- **Interfaces**: `<NomeDoServico>Request`
- **Concatenação**: Usar `&` para adicionar atributos extras

## Rotas

### Estrutura Atual

As rotas estão organizadas no arquivo `routes.ts` por funcionalidade:

```typescript
// ROTAS AUTH
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);

// ROTAS USERS
router.post("/users", new CreateUserController().handle);
router.get("/users", isAuthenticated, new ListAllUsersController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.post("/assessments", isAuthenticated, new CreateAssessmentController().handle);
```

### Middlewares

- `isAuthenticated`: Verifica se o usuário está autenticado
- Aplicado na maioria das rotas, exceto auth e algumas rotas públicas

## Melhorias a serem feitas

### 1. Inconsistências nos Services

**Problema**: Alguns services que deveriam estar nas classes de admin têm sua file própria.

**Solução**: Mover esses services para as classes admin correspondentes à sua tabela no banco de dados.

### 2. Organização das Rotas Admin

**Problema**: Nem todas as rotas de admin têm `/admin` no início.

**Solução**: Reestruturar para que todas as rotas administrativas comecem com `/admin`:

```typescript
// Atual
router.get("/users/admin", ...)

// Proposto
router.get("/admin/users", ...)
```

### 3. Padronização de Parâmetros de ID

**Problema**: Algumas rotas usam `:nomeDaTabelaId` como parâmetro.

**Solução**: Usar apenas `:id` quando o ID é do objeto principal da rota:

```typescript
// Atual
router.get("/users/:userId", ...)

// Proposto
router.get("/users/:id", ...)
```

### 4. Hierarquia de Rotas

**Problema**: Rotas relacionadas não seguem uma hierarquia clara.

**Solução**: Organizar rotas hierarquicamente:

```typescript
// Para acessar um assessment específico
router.get("/assessments/:id", ...)

// Para acessar resultados de um assessment específico
router.get("/assessments/:id/results", ...)

// Para acessar um resultado específico
router.get("/assessments/results/:id", ...)
```

### 5. Organização de Services Relacionados

**Problema**: Serviços de tabelas relacionadas estão no mesmo folder.

**Solução**: Organizar serviços relacionados em subpastas:

```
services/
├── assessment/
│   ├── AssessmentService.ts
│   └── result/
│       └── ResultService.ts
```

## Cuidados com Migrations

### ⚠️ ATENÇÃO CRÍTICA

**JAMAIS execute uma migration que apagará todo o banco de dados**, pois mesmo que não importe para o desenvolvimento local, essa migration subirá para produção eventualmente.

**⚠️ ATENÇÃO ESPECIAL**: O projeto possui bancos de dados separados na **Neon** para os ambientes **DEV**, **QA** e **Produção**. Migrations aplicadas afetarão o ambiente correspondente à configuração atual.

### Boas Práticas para Migrations

1. **Use `--create-only` quando necessário**:

   ```bash
   npx prisma migrate dev --create-only --name descriptive_name
   ```

2. **Sempre revisar migrations antes de aplicar**:

   - Verifique se não há comandos destrutivos
   - Confirme que dados existentes permanecerão intactos

3. **Para alterações que requerem migração manual**:

   - Use `--create-only` para gerar o arquivo
   - Edite manualmente para preservar dados
   - Aplique com cuidado

4. **Testes de Migration**:
   - Sempre teste primeiro no ambiente **DEV**
   - Depois valide no ambiente **QA**
   - Só então aplique em **Produção**
   - Faça backup antes de aplicar em produção
   - Tenha um plano de rollback
   - **Lembre-se**: Cada ambiente na Neon (DEV/QA/Produção) será afetado conforme a configuração

### Exemplo de Migration Segura

```sql
-- Migration para adicionar coluna sem perder dados
ALTER TABLE "User" ADD COLUMN "newField" TEXT;

-- Migration para alterar tipo de coluna preservando dados
ALTER TABLE "User" ADD COLUMN "newFieldTemp" INTEGER;
UPDATE "User" SET "newFieldTemp" = CAST("oldField" AS INTEGER) WHERE "oldField" IS NOT NULL;
ALTER TABLE "User" DROP COLUMN "oldField";
ALTER TABLE "User" RENAME COLUMN "newFieldTemp" TO "oldField";
```

## Conclusão

Esta documentação serve como guia para manter a consistência e qualidade do código no backend. As melhorias identificadas devem ser implementadas gradualmente para manter a estabilidade do sistema em produção.

### Próximos Passos

1. Implementar correções de inconsistências nos services
2. Reestruturar rotas admin para usar prefixo `/admin`
3. Padronizar parâmetros de ID nas rotas
4. Reorganizar hierarquia de rotas relacionadas
5. Reestruturar organização de services em subpastas

Lembre-se sempre de testar thoroughly antes de fazer deploy em produção e ter especial cuidado com migrations.
