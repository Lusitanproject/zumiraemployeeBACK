# Granularidade de acesso a recursos (company / owned / platform)

Padrão de autorização por recurso usado primeiro no domínio de **atos** (`ActChatbot`) e pensado para
ser **replicado em outros domínios** (ex.: assessments). Descreve como dar granularidade de leitura,
edição, deleção e análise por dono/empresa, reaproveitando middlewares e utilitários existentes.

## Os três eixos

Cada recurso tem dois campos que definem o acesso:

- `companyId` (nullable) — a empresa dona do recurso.
- `ownerId` (nullable, FK → `User`) — o usuário que criou o recurso.

A partir deles, três escopos:

| Escopo     | Significado                                         | Filtro                         |
| ---------- | --------------------------------------------------- | ------------------------------ |
| `company`  | Recursos da minha empresa (engloba os meus)         | `companyId === user.companyId` |
| `owned`    | Recursos que **eu** criei                           | `ownerId === user.id`          |
| `platform` | Recursos da Zumira, sem dono (criados via `/admin`) | `companyId === null`           |

Regras importantes:

- `owned` basta `ownerId === user.id` — **independe** do `companyId` atual (um ato que criei continua
  meu mesmo que eu mude de empresa).
- Recursos `platform` (`companyId === null`) **só** são acessíveis se o escopo `platform` for
  permitido naquela ação. Onde `platform` não se aplica (ex.: editar/deletar), recursos Zumira ficam
  **sempre bloqueados** fora de `/admin`.

## Família de permissões

Por ação, uma permissão por escopo, seguindo a convenção `<recurso>-<ação>-<escopo>`:

```
<recurso>-read-company        <recurso>-read-owned        <recurso>-read-platform
<recurso>-update-company      <recurso>-update-owned
<recurso>-delete-company      <recurso>-delete-owned
<recurso>-read-analysis-company  <recurso>-read-analysis-owned  <recurso>-read-analysis-platform
```

Edição/deleção **não** têm escopo `platform` (recursos Zumira não são editáveis/deletáveis aqui).
Leitura e análise têm os três.

Defina as keys no domínio (`src/permissions/<recurso>.ts`), no objeto de constantes e no
`<Recurso>Domain.permissions` (com `label`). `ALL_PERMISSIONS` (`src/permissions/index.ts`) deriva
automaticamente, e o tipo `Permission` passa a aceitar as novas keys.

Exemplo (atos — `src/permissions/acts.ts`):

```ts
READ_COMPANY: "acts-read-company",
READ_OWNED: "acts-read-owned",
READ_PLATFORM: "acts-read-platform",
UPDATE_COMPANY: "acts-update-company",
UPDATE_OWNED: "acts-update-owned",
DELETE_COMPANY: "acts-delete-company",
DELETE_OWNED: "acts-delete-owned",
READ_ANALYSIS_COMPANY: "acts-read-analysis-company",
READ_ANALYSIS_OWNED: "acts-read-analysis-owned",
READ_ANALYSIS_PLATFORM: "acts-read-analysis-platform",
```

## Peças reutilizáveis

### `hasPermission(user, permission)` — `src/utils/permissions.ts`

Checagem central (com bypass de `admin`), usável dentro da lógica de negócio (não só em middleware):

```ts
hasPermission(user, "acts-read-company"); // true se admin OU tiver a permissão
```

### `requirePermissions(perms, { match })` — `src/middlewares/requirePermissions.ts`

Gate de permissões puro (sem tocar o banco). `match: "all"` (default) ou `"any"` (OR). Use para
listagens, onde não há um recurso único a carregar:

```ts
requirePermissions(["acts-read-company", "acts-read-owned", "acts-read-platform"], { match: "any" });
```

### `requireActAccess(scope)` — `src/middlewares/requireActAccess.ts`

Autorização **por recurso**: carrega o ato pelo id da rota e aplica os três escopos. É o template a
generalizar para outros recursos (ex.: um `requireAssessmentAccess`).

```ts
requireActAccess({
  idParam: "actChatbotId", // default "id"
  company: "acts-read-analysis-company",
  owned: "acts-read-analysis-owned",
  platform: "acts-read-analysis-platform", // omita para bloquear sempre recursos Zumira
});
```

Regra de decisão: `admin` passa direto; senão, se `companyId === null` exige o escopo `platform`;
caso contrário permite se (`company` + mesma empresa) **ou** (`owned` + sou o dono). Recurso
inexistente → 403 (não vaza existência).

## Composição com `requireSameCompany`

Há um eixo ortogonal: rotas de **análise** recebem um `companyId` na query (a empresa **consumidora**
dos dados). `requireSameCompany()` (`src/middlewares/requireSameCompany.ts`) força esse `companyId` a
ser o da própria empresa. Os dois middlewares **compõem**:

```ts
requireActAccess({ idParam: "actChatbotId", company, owned, platform }), // ownership do ato
requireSameCompany(),                                                    // dados da minha empresa
```

`requireActAccess` decide _de quais atos_ você pode ver análise; `requireSameCompany` garante que os
dados são _da sua empresa_.

## Convenção de uso

Parâmetros são tipados com `Permission`, mas os **call sites passam a string literal**
(`"acts-update-company"`), não `ActPermissions.X`. O tipo já garante o type-check do literal; o objeto
de constantes/domain segue como fonte da verdade (definição + labels).

## Checklist para um novo recurso (ex.: assessments)

1. Adicionar `ownerId String? @map("owner_id")` + relação `owner User?` no model; back-relation no
   `User`. Migration com `prisma migrate dev --create-only`. Setar `ownerId = req.user.id` na criação.
2. Criar a família de keys/labels em `src/permissions/<recurso>.ts`.
3. Parametrizar/clonar o middleware de acesso por recurso (idParam, escopos) — ou generalizar
   `requireActAccess` se valer a pena.
4. Trocar as rotas: listagens usam `requirePermissions([...], { match: "any" })`; rotas de recurso
   único usam o middleware de acesso (removendo `requirePermissions`/`requireCompany` redundantes);
   análise compõe com `requireSameCompany()`.
5. Tirar a autorização de dentro do service (que volta a operar por `id`), já que o middleware decide.
6. Atualizar Swagger das rotas.

## Migração de grants

As keys mudam ao adotar a granularidade (ex.: `acts-update` → `acts-update-company`/`-owned`). Papéis
que tinham a key antiga **param de funcionar** até receberem as novas. Os grants vivem na tabela
`RolePermission` (runtime), não em seed — re-conceder conforme o caso.
