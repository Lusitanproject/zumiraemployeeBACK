# Redesign de Permissões

## Regras gerais aplicadas

1. **Prefixo `admin-`**: todas as permissões usadas exclusivamente em rotas `/admin/*` ganham o prefixo `admin-`.
2. **Admin = manage**: permissões admin usam sufixo `-manage` (uma permissão por domínio cobre todo o CRUD).
3. **Rotas não-admin**: permissões do usuário final não levam prefixo `admin-` e são semânticas por natureza.

## Mudanças de infraestrutura necessárias

- **`requirePermissions` middleware**: atualmente aceita apenas `string`. Precisa passar a aceitar `string | string[]`, exigindo **todas** as permissões do array (AND). Necessário para rotas de sync que requerem `company-users-write` + `company-users-update` simultaneamente.

---

## Rotas Admin (`/admin/*`)

### Atos — `/admin/acts`

**Atual:** `manage-acts` → **Proposta:** `admin-acts-manage`

| Permissão proposta  | Rotas cobertas                                                                                                                                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-acts-manage` | `GET /admin/acts` · `GET /admin/acts/by-trail` · `GET /admin/acts/:id` · `POST /admin/acts` · `POST /admin/acts/:id/import-chatbase-chapters` · `POST /admin/acts/:id/analysis` · `PUT /admin/acts/:id` · `PUT /admin/acts/update-many` · `PUT /admin/acts/analysis/factor-associations` |

---

### Avaliações — `/admin/assessments`

**Atual:** `manage-assessments` → **Proposta:** `admin-assessments-manage`

| Permissão proposta          | Rotas cobertas                                                                                                                                                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-assessments-manage`  | `GET /admin/assessments` · `GET /admin/assessments/:id` · `GET /admin/assessments/results` · `GET /admin/assessments/results/download-report` · `GET /admin/assessments/questions/:assessmentId` · `GET /admin/assessments/ratings/:id` · `POST /admin/assessments/duplicate/:id` · `PUT /admin/assessments/:id` · `PUT /admin/assessments/ratings/:id` |

---

### Empresas — `/admin/companies`

**Atual:** `manage-company` → **Proposta:** `admin-companies-manage`

| Permissão proposta        | Rotas cobertas                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-companies-manage`  | `GET /admin/companies` · `GET /admin/companies/feedback` · `POST /admin/companies` · `POST /admin/companies/:id/assessments` · `POST /admin/companies/:companyId/feedback/users` · `PUT /admin/companies/:id` |

---

### Dimensões — `/admin/dimensions`

**Atual:** `manage-dimension` → **Proposta:** `admin-dimensions-manage`

| Permissão proposta         | Rotas cobertas                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `admin-dimensions-manage`  | `GET /admin/dimensions` · `GET /admin/dimensions/:id` · `POST /admin/dimensions` · `PUT /admin/dimensions/:id` |

---

### Nacionalidades — `/admin/nationalities`

**Atual:** `manage-nationalities` → **Proposta:** `admin-nationalities-manage`

| Permissão proposta            | Rotas cobertas                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `admin-nationalities-manage`  | `GET /admin/nationalities` · `GET /admin/nationalities/:id` · `POST /admin/nationalities` · `PUT /admin/nationalities/:id` |

---

### Notificações — `/admin/notifications`

**Atual:** `manage-notifications` → **Proposta:** `admin-notifications-manage`

| Permissão proposta             | Rotas cobertas                                                                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-notifications-manage`   | `GET /admin/notifications` · `GET /admin/notifications/types` · `GET /admin/notifications/types/:id` · `POST /admin/notifications` · `POST /admin/notifications/types` · `PUT /admin/notifications/:notificationId` · `PUT /admin/notifications/types/:id` · `DELETE /admin/notifications/:notificationId` |

---

### Perfis (Roles) — `/admin/roles` e `/admin/permissions`

**Atual:** `manage-roles` → **Proposta:** `admin-roles-manage`

> `GET /admin/permissions` (listar permissões disponíveis) continua coberto pela mesma permissão de roles, pois é operação auxiliar para configurar papéis.

| Permissão proposta    | Rotas cobertas                                                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-roles-manage`  | `GET /admin/roles` · `GET /admin/roles/:id` · `GET /admin/permissions` · `POST /admin/roles` · `PUT /admin/roles/:id` · `PUT /admin/roles/:id/permissions` · `DELETE /admin/roles/:id` |

---

### Fatores Psicossociais — `/admin/psychosocial-factors`

**Atual:** `manage-psychosocial-factors` → **Proposta:** `admin-psychosocial-factors-manage`

| Permissão proposta                    | Rotas cobertas                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-psychosocial-factors-manage`   | `GET /admin/psychosocial-factors` · `GET /admin/psychosocial-factors/:id` · `POST /admin/psychosocial-factors` · `PUT /admin/psychosocial-factors/:id` · `DELETE /admin/psychosocial-factors/:id` |

---

### Automonitoramento — `/admin/self-monitoring`

**Atual:** `manage-self-monitoring` → **Proposta:** `admin-self-monitoring-manage`

| Permissão proposta               | Rotas cobertas                                                                                                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-self-monitoring-manage`   | `GET /admin/self-monitoring` · `GET /admin/self-monitoring/:id` · `GET /admin/self-monitoring/dimensions/:selfMonitoringBlockId` · `POST /admin/self-monitoring` · `PUT /admin/self-monitoring/:id` |

---

### Trilhas — `/admin/trails`

**Atual:** `manage-trails` → **Proposta:** `admin-trails-manage`

| Permissão proposta     | Rotas cobertas                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `admin-trails-manage`  | `GET /admin/trails` · `GET /admin/trails/:id` · `POST /admin/trails` · `PUT /admin/trails/:id` |

---

## Rotas de usuário final (não-admin)

### Atos — `/acts`

**Atual:** `answer-act` · `view-act-analysis`

| Permissão proposta   | Rotas cobertas                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `acts-engage`        | `GET /acts/by-company` · `GET /acts` · `GET /acts/chapters` · `GET /acts/full-story` · `GET /acts/:id` · `POST /acts/message` · `POST /acts/new-chapter` · `POST /acts/chapters/compile` · `PUT /acts/next` · `PUT /acts/chapters/:actChapterId` |
| `acts-read-analysis` | `GET /acts/:id/analysis` · `GET /acts/:id/analysis/summary` · `GET /acts/:id/analysis/report` · `GET /acts/:id/analysis/user-filters` · `GET /acts/:id/analysis/factors/:factorId/messages` · `POST /acts/:id/analysis/message`                  |

---

### Avaliações — `/assessments`

**Atual:** `answer-assessment` · `manage-assessments` · `view-assessment-results`

> **TODO (migração futura):** `POST /assessments`, `POST /assessments/questions`, `PUT /assessments/questions/:id` são operações de gestão em rota não-admin. Devem migrar para `/admin/assessments`. Por enquanto usam `admin-assessments-manage`.

| Permissão proposta          | Rotas cobertas                                                                                                                                                                                                                                                                   | Atual                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `assessments-engage`        | `GET /assessments` · `GET /assessments/company` · `GET /assessments/alerts` · `GET /assessments/results` · `GET /assessments/results/:id` · `GET /assessments/:id` · `PUT /assessments/alerts/:id/read` · `POST /assessments/results` · `POST /assessments/feedback/users/:id` | _(sem permissão / `answer-assessment`)_ |
| `assessments-read-analysis` | `GET /assessments/:id/results` · `GET /assessments/:id/results/user-filters` · `POST /assessments/:id/analysis/message` · `POST /assessments/feedback/companies/:id`                                                                                                             | `view-assessment-results`               |
| `admin-assessments-manage`  | `POST /assessments` · `POST /assessments/questions` · `PUT /assessments/questions/:id` _(rotas não-admin, migração futura)_                                                                                                                                                      | `manage-assessments`                    |

---

### Empresas — `/companies`

**Atual:** `view-company-users` · `manage-company` · `view-assessment-results`

| Rota                                 | Método | O que faz                                   | Permissão proposta                             | Atual                     |
| ------------------------------------ | ------ | ------------------------------------------- | ---------------------------------------------- | ------------------------- |
| `/companies/:companyId`              | GET    | Busca dados da empresa                      | `companies-read`                               | `view-company-users`      |
| `/companies/:companyId/users`        | GET    | Lista usuários da empresa                   | `company-users-read`                           | `manage-company`          |
| `/companies/:companyId/users/:id`    | GET    | Busca um usuário da empresa                 | `company-users-read`                           | `manage-company`          |
| `/companies/:companyId/users/search` | GET    | Busca usuários com filtros                  | `company-users-read`                           | `manage-company`          |
| `/companies/:id/feedback`            | GET    | Feedback de IA do assessment para a empresa | `assessments-read-analysis`                    | `view-assessment-results` |
| `/companies/users`                   | POST   | Cria um usuário na empresa do gestor        | `company-users-write`                          | `manage-company`          |
| `/companies/users/batch`             | POST   | Cria múltiplos usuários na empresa          | `company-users-write`                          | `manage-company`          |
| `/companies/:id/users/sync/preview`  | POST   | Preview de sync via lista externa           | `company-users-write` + `company-users-update` | `manage-company`          |
| `/companies/:id/users/sync/execute`  | POST   | Executa o sync de usuários                  | `company-users-write` + `company-users-update` | `manage-company`          |
| `/companies/:companyId/users/:id`    | PUT    | Atualiza um usuário da empresa              | `company-users-update`                         | `manage-company`          |
| `/companies/:companyId/users/:id`    | DELETE | Remove um usuário da empresa                | `company-users-delete`                         | `manage-company`          |

---

### Usuários — `/users`

**Atual:** `manage-users` · `view-company-users`

> **TODO (migração futura):** `/admin/users` existe mas está vazio. Operações de gestão de usuários devem migrar para lá. Por enquanto as rotas permanecem em `/users` mas passam a usar `admin-users-manage`.

| Rota             | Método | O que faz                  | Permissão proposta          | Atual          |
| ---------------- | ------ | -------------------------- | --------------------------- | -------------- |
| `/users`         | GET    | Lista todos os usuários    | `admin-users-manage`        | `manage-users` |
| `/users/search`  | GET    | Busca usuários com filtros | `admin-users-manage`        | `manage-users` |
| `/users/filters` | GET    | Retorna opções de filtro   | `admin-users-manage`        | `manage-users` |
| `/users/find-by` | GET    | Busca usuário por campo    | `admin-users-manage`        | _(nenhuma)_    |
| `/users/:userId` | GET    | Detalha um usuário         | `admin-users-manage`        | _(nenhuma)_    |
| `/users/:id`     | PUT    | Atualiza um usuário        | `admin-users-manage`        | `manage-users` |
| `/users/:id`     | DELETE | Remove um usuário          | `admin-users-manage`        | `manage-users` |
| `/users`         | POST   | Cria um usuário            | _(pública — sem permissão)_ | _(nenhuma)_    |

---

### Notificações — `/notifications` (usuário final)

**Atual:** sem permissão (apenas autenticado)

> São notificações pessoais do usuário. Não requer permissão diferenciada — apenas `isAuthenticated` é suficiente. Manter como está.

---

### Rotas públicas (sem permissão necessária)

- `GET /nationalities` — listagem pública
- `GET /psychosocial-factors` — listagem para usuário autenticado
- `GET /self-monitoring` — listagem para usuário autenticado
- `POST /leads` — público
- `POST /auth/email` e `POST /auth/verify` — público

---

## Resumo das permissões existentes × propostas

| Permissão atual               | Substitui por                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `manage-acts`                 | `admin-acts-manage`                                                                                               |
| `manage-assessments`          | `admin-assessments-manage`                                                                                        |
| `manage-company`              | `admin-companies-manage` · `company-users-write` · `company-users-update` · `company-users-delete`               |
| `manage-dimension`            | `admin-dimensions-manage`                                                                                         |
| `manage-nationalities`        | `admin-nationalities-manage`                                                                                      |
| `manage-notifications`        | `admin-notifications-manage`                                                                                      |
| `manage-psychosocial-factors` | `admin-psychosocial-factors-manage`                                                                               |
| `manage-roles`                | `admin-roles-manage`                                                                                              |
| `manage-self-monitoring`      | `admin-self-monitoring-manage`                                                                                    |
| `manage-trails`               | `admin-trails-manage`                                                                                             |
| `manage-users`                | `admin-users-manage`                                                                                              |
| `answer-act`                  | `acts-engage`                                                                                                     |
| `view-act-analysis`           | `acts-read-analysis`                                                                                              |
| `answer-assessment`           | `assessments-engage`                                                                                              |
| `view-assessment-results`     | `assessments-read-analysis`                                                                                       |
| `view-company-users`          | `companies-read` · `company-users-read`                                                                           |

---

## Mapeamento completo: Endpoint × Permissão

| Método | Rota                                                       | O que faz                                                     | Permissão                                      |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| GET    | `/admin/acts`                                              | Lista todos os ACTs do sistema                                | `admin-acts-manage`                            |
| GET    | `/admin/acts/by-trail`                                     | Lista ACTs de uma trilha específica                           | `admin-acts-manage`                            |
| GET    | `/admin/acts/:id`                                          | Detalha um ACT                                                | `admin-acts-manage`                            |
| POST   | `/admin/acts`                                              | Cria um ACT                                                   | `admin-acts-manage`                            |
| POST   | `/admin/acts/:id/import-chatbase-chapters`                 | Importa capítulos do Chatbase para um ACT                     | `admin-acts-manage`                            |
| POST   | `/admin/acts/:id/analysis`                                 | Dispara análise em lote dos capítulos do ACT para uma empresa | `admin-acts-manage`                            |
| PUT    | `/admin/acts/:id`                                          | Atualiza um ACT                                               | `admin-acts-manage`                            |
| PUT    | `/admin/acts/update-many`                                  | Atualiza múltiplos ACTs                                       | `admin-acts-manage`                            |
| PUT    | `/admin/acts/analysis/factor-associations`                 | Corrige associações de fatores psicossociais nas mensagens    | `admin-acts-manage`                            |
| GET    | `/admin/assessments`                                       | Lista todas as avaliações                                     | `admin-assessments-manage`                     |
| GET    | `/admin/assessments/:id`                                   | Detalha uma avaliação                                         | `admin-assessments-manage`                     |
| GET    | `/admin/assessments/results`                               | Lista resultados filtrados das avaliações                     | `admin-assessments-manage`                     |
| GET    | `/admin/assessments/results/download-report`               | Gera relatório Excel dos resultados                           | `admin-assessments-manage`                     |
| GET    | `/admin/assessments/questions/:assessmentId`               | Lista questões de uma avaliação                               | `admin-assessments-manage`                     |
| GET    | `/admin/assessments/ratings/:id`                           | Busca ratings de resultado de uma avaliação                   | `admin-assessments-manage`                     |
| POST   | `/admin/assessments/duplicate/:id`                         | Duplica uma avaliação                                         | `admin-assessments-manage`                     |
| PUT    | `/admin/assessments/:id`                                   | Atualiza uma avaliação                                        | `admin-assessments-manage`                     |
| PUT    | `/admin/assessments/ratings/:id`                           | Atualiza ratings de resultado                                 | `admin-assessments-manage`                     |
| GET    | `/admin/companies`                                         | Lista todas as empresas                                       | `admin-companies-manage`                       |
| GET    | `/admin/companies/feedback`                                | Lista feedbacks das empresas                                  | `admin-companies-manage`                       |
| POST   | `/admin/companies`                                         | Cria uma empresa                                              | `admin-companies-manage`                       |
| POST   | `/admin/companies/:id/assessments`                         | Atribui uma avaliação a uma empresa                           | `admin-companies-manage`                       |
| POST   | `/admin/companies/:companyId/feedback/users`               | Gera feedback de IA para usuários de uma empresa              | `admin-companies-manage`                       |
| PUT    | `/admin/companies/:id`                                     | Atualiza uma empresa                                          | `admin-companies-manage`                       |
| GET    | `/admin/dimensions`                                        | Lista todas as dimensões psicológicas                         | `admin-dimensions-manage`                      |
| GET    | `/admin/dimensions/:id`                                    | Detalha uma dimensão                                          | `admin-dimensions-manage`                      |
| POST   | `/admin/dimensions`                                        | Cria uma dimensão                                             | `admin-dimensions-manage`                      |
| PUT    | `/admin/dimensions/:id`                                    | Atualiza uma dimensão                                         | `admin-dimensions-manage`                      |
| GET    | `/admin/nationalities`                                     | Lista todas as nacionalidades                                 | `admin-nationalities-manage`                   |
| GET    | `/admin/nationalities/:id`                                 | Detalha uma nacionalidade                                     | `admin-nationalities-manage`                   |
| POST   | `/admin/nationalities`                                     | Cria uma nacionalidade                                        | `admin-nationalities-manage`                   |
| PUT    | `/admin/nationalities/:id`                                 | Atualiza uma nacionalidade                                    | `admin-nationalities-manage`                   |
| GET    | `/admin/notifications`                                     | Lista notificações                                            | `admin-notifications-manage`                   |
| GET    | `/admin/notifications/types`                               | Lista tipos de notificação                                    | `admin-notifications-manage`                   |
| GET    | `/admin/notifications/types/:id`                           | Detalha um tipo de notificação                                | `admin-notifications-manage`                   |
| POST   | `/admin/notifications`                                     | Envia uma notificação                                         | `admin-notifications-manage`                   |
| POST   | `/admin/notifications/types`                               | Cria um tipo de notificação                                   | `admin-notifications-manage`                   |
| PUT    | `/admin/notifications/:notificationId`                     | Atualiza uma notificação                                      | `admin-notifications-manage`                   |
| PUT    | `/admin/notifications/types/:id`                           | Atualiza um tipo de notificação                               | `admin-notifications-manage`                   |
| DELETE | `/admin/notifications/:notificationId`                     | Remove uma notificação                                        | `admin-notifications-manage`                   |
| GET    | `/admin/permissions`                                       | Lista todas as permissões disponíveis do sistema              | `admin-roles-manage`                           |
| GET    | `/admin/roles`                                             | Lista todos os perfis                                         | `admin-roles-manage`                           |
| GET    | `/admin/roles/:id`                                         | Detalha um perfil                                             | `admin-roles-manage`                           |
| POST   | `/admin/roles`                                             | Cria um perfil                                                | `admin-roles-manage`                           |
| PUT    | `/admin/roles/:id`                                         | Atualiza nome/descrição de um perfil                          | `admin-roles-manage`                           |
| PUT    | `/admin/roles/:id/permissions`                             | Define as permissões de um perfil                             | `admin-roles-manage`                           |
| DELETE | `/admin/roles/:id`                                         | Remove um perfil                                              | `admin-roles-manage`                           |
| GET    | `/admin/psychosocial-factors`                              | Lista todos os fatores psicossociais                          | `admin-psychosocial-factors-manage`            |
| GET    | `/admin/psychosocial-factors/:id`                          | Detalha um fator psicossocial                                 | `admin-psychosocial-factors-manage`            |
| POST   | `/admin/psychosocial-factors`                              | Cria um fator psicossocial                                    | `admin-psychosocial-factors-manage`            |
| PUT    | `/admin/psychosocial-factors/:id`                          | Atualiza um fator psicossocial                                | `admin-psychosocial-factors-manage`            |
| DELETE | `/admin/psychosocial-factors/:id`                          | Remove um fator psicossocial                                  | `admin-psychosocial-factors-manage`            |
| GET    | `/admin/self-monitoring`                                   | Lista todos os blocos de automonitoramento                    | `admin-self-monitoring-manage`                 |
| GET    | `/admin/self-monitoring/:id`                               | Detalha um bloco de automonitoramento                         | `admin-self-monitoring-manage`                 |
| GET    | `/admin/self-monitoring/dimensions/:selfMonitoringBlockId` | Lista dimensões de um bloco                                   | `admin-self-monitoring-manage`                 |
| POST   | `/admin/self-monitoring`                                   | Cria um bloco de automonitoramento                            | `admin-self-monitoring-manage`                 |
| PUT    | `/admin/self-monitoring/:id`                               | Atualiza um bloco de automonitoramento                        | `admin-self-monitoring-manage`                 |
| GET    | `/admin/trails`                                            | Lista todas as trilhas                                        | `admin-trails-manage`                          |
| GET    | `/admin/trails/:id`                                        | Detalha uma trilha                                            | `admin-trails-manage`                          |
| POST   | `/admin/trails`                                            | Cria uma trilha                                               | `admin-trails-manage`                          |
| PUT    | `/admin/trails/:id`                                        | Atualiza uma trilha                                           | `admin-trails-manage`                          |
| GET    | `/acts/by-company`                                         | Lista ACTs disponíveis para a empresa do usuário              | `acts-engage`                                  |
| GET    | `/acts`                                                    | Retorna dados dos ACTs do usuário                             | `acts-engage`                                  |
| GET    | `/acts/chapters`                                           | Busca capítulos do ACT atual do usuário                       | `acts-engage`                                  |
| GET    | `/acts/full-story`                                         | Retorna a história completa do ACT                            | `acts-engage`                                  |
| GET    | `/acts/:id`                                                | Detalha um ACT específico                                     | `acts-engage`                                  |
| POST   | `/acts/message`                                            | Envia mensagem ao chatbot do ACT                              | `acts-engage`                                  |
| POST   | `/acts/new-chapter`                                        | Cria novo capítulo do ACT                                     | `acts-engage`                                  |
| POST   | `/acts/chapters/compile`                                   | Compila capítulo concluído                                    | `acts-engage`                                  |
| PUT    | `/acts/next`                                               | Avança para o próximo ACT                                     | `acts-engage`                                  |
| PUT    | `/acts/chapters/:actChapterId`                             | Atualiza um capítulo do ACT                                   | `acts-engage`                                  |
| GET    | `/acts/:actChatbotId/analysis`                             | Busca análise consolidada do ACT                              | `acts-read-analysis`                           |
| GET    | `/acts/:actChatbotId/analysis/summary`                     | Resumo da análise do ACT                                      | `acts-read-analysis`                           |
| GET    | `/acts/:actChatbotId/analysis/report`                      | Relatório da análise do ACT                                   | `acts-read-analysis`                           |
| GET    | `/acts/:actChatbotId/analysis/user-filters`                | Filtros disponíveis para a análise                            | `acts-read-analysis`                           |
| GET    | `/acts/:actChatbotId/analysis/factors/:factorId/messages`  | Mensagens de um fator psicossocial na análise                 | `acts-read-analysis`                           |
| POST   | `/acts/:actChatbotId/analysis/message`                     | Chat com IA sobre a análise do ACT                            | `acts-read-analysis`                           |
| GET    | `/assessments`                                             | Lista avaliações disponíveis para o usuário                   | `assessments-engage`                           |
| GET    | `/assessments/company`                                     | Lista avaliações da empresa do usuário                        | `assessments-engage`                           |
| GET    | `/assessments/alerts`                                      | Lista alertas de avaliação do usuário                         | `assessments-engage`                           |
| GET    | `/assessments/results`                                     | Lista resultados de avaliações do próprio usuário             | `assessments-engage`                           |
| GET    | `/assessments/results/:id`                                 | Detalha um resultado de avaliação do próprio usuário          | `assessments-engage`                           |
| GET    | `/assessments/:id`                                         | Detalha uma avaliação com questões                            | `assessments-engage`                           |
| PUT    | `/assessments/alerts/:id/read`                             | Marca alerta como lido                                        | `assessments-engage`                           |
| POST   | `/assessments/results`                                     | Registra resposta de uma avaliação                            | `assessments-engage`                           |
| POST   | `/assessments/feedback/users/:id`                          | Gera feedback de IA para o próprio usuário                    | `assessments-engage`                           |
| GET    | `/assessments/:id/results`                                 | Busca resultados de uma avaliação por empresa                 | `assessments-read-analysis`                    |
| GET    | `/assessments/:id/results/user-filters`                    | Filtros para exibição de resultados por empresa               | `assessments-read-analysis`                    |
| POST   | `/assessments/:id/analysis/message`                        | Chat com IA sobre resultados consolidados da empresa          | `assessments-read-analysis`                    |
| POST   | `/assessments/feedback/companies/:id`                      | Gera feedback de IA para a empresa                            | `assessments-read-analysis`                    |
| POST   | `/assessments`                                             | Cria uma avaliação                                            | `admin-assessments-manage` _(migração futura)_ |
| POST   | `/assessments/questions`                                   | Cria questões de uma avaliação                                | `admin-assessments-manage` _(migração futura)_ |
| PUT    | `/assessments/questions/:id`                               | Atualiza questões de uma avaliação                            | `admin-assessments-manage` _(migração futura)_ |
| GET    | `/companies/:companyId`                                    | Busca dados da empresa                                        | `companies-read`                               |
| GET    | `/companies/:companyId/users`                              | Lista usuários da empresa                                     | `company-users-read`                           |
| GET    | `/companies/:companyId/users/:id`                          | Detalha um usuário da empresa                                 | `company-users-read`                           |
| GET    | `/companies/:companyId/users/search`                       | Busca usuários da empresa com filtros                         | `company-users-read`                           |
| GET    | `/companies/:id/feedback`                                  | Busca feedback de IA do assessment para a empresa             | `assessments-read-analysis`                    |
| POST   | `/companies/users`                                         | Cria um usuário na empresa do gestor                          | `company-users-write`                          |
| POST   | `/companies/users/batch`                                   | Cria múltiplos usuários na empresa do gestor                  | `company-users-write`                          |
| POST   | `/companies/:id/users/sync/preview`                        | Preview de sincronização de usuários via lista externa        | `company-users-write` + `company-users-update` |
| POST   | `/companies/:id/users/sync/execute`                        | Executa sincronização de usuários                             | `company-users-write` + `company-users-update` |
| PUT    | `/companies/:companyId/users/:id`                          | Atualiza um usuário da empresa                                | `company-users-update`                         |
| DELETE | `/companies/:companyId/users/:id`                          | Remove um usuário da empresa                                  | `company-users-delete`                         |
| GET    | `/users`                                                   | Lista todos os usuários do sistema                            | `admin-users-manage` _(migração futura)_       |
| GET    | `/users/search`                                            | Busca usuários com filtros                                    | `admin-users-manage` _(migração futura)_       |
| GET    | `/users/filters`                                           | Retorna opções de filtro disponíveis                          | `admin-users-manage` _(migração futura)_       |
| GET    | `/users/find-by`                                           | Busca usuário por campo específico                            | `admin-users-manage` _(migração futura)_       |
| GET    | `/users/:userId`                                           | Detalha um usuário                                            | `admin-users-manage` _(migração futura)_       |
| PUT    | `/users/:id`                                               | Atualiza um usuário                                           | `admin-users-manage` _(migração futura)_       |
| DELETE | `/users/:id`                                               | Remove um usuário                                             | `admin-users-manage` _(migração futura)_       |
| POST   | `/users`                                                   | Cria um usuário                                               | _(pública)_                                    |
| GET    | `/notifications`                                           | Lista notificações do usuário logado                          | _(apenas autenticado)_                         |
| GET    | `/notifications/:notificationId`                           | Detalha uma notificação                                       | _(apenas autenticado)_                         |
| PUT    | `/notifications/:notificationId/read`                      | Marca notificação como lida                                   | _(apenas autenticado)_                         |
| GET    | `/nationalities`                                           | Lista nacionalidades                                          | _(pública)_                                    |
| GET    | `/psychosocial-factors`                                    | Lista fatores psicossociais                                   | _(apenas autenticado)_                         |
| GET    | `/self-monitoring`                                         | Lista blocos de automonitoramento                             | _(apenas autenticado)_                         |
| POST   | `/leads`                                                   | Cadastra um lead                                              | _(pública)_                                    |
| POST   | `/auth/email`                                              | Envia código de verificação por e-mail                        | _(pública)_                                    |
| POST   | `/auth/verify`                                             | Verifica código e autentica o usuário                         | _(pública)_                                    |
