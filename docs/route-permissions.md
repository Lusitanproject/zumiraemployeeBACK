# Permissões por rota

Legenda:

- **—** = sem autenticação (rota pública)
- _(auth)_ = requer apenas autenticação, sem permissão específica

---

## Auth

| Método | Rota           | Permissão |
| ------ | -------------- | --------- |
| POST   | `/auth/email`  | —         |
| POST   | `/auth/verify` | —         |

---

## Users

| Método | Rota                        | Permissão            |
| ------ | --------------------------- | -------------------- |
| POST   | `/users`                    | —                    |
| GET    | `/users/find-by`            | _(auth)_             |
| GET    | `/users/:userId`            | _(auth)_             |
| GET    | `/users/search`             | `manage-users`       |
| GET    | `/users/filters`            | `manage-users`       |
| GET    | `/users`                    | `manage-users`       |
| PUT    | `/users/:id`                | `manage-users`       |
| DELETE | `/users/:id`                | `manage-users`       |
| GET    | `/users/company/:companyId` | `view-company-users` |

---

## Assessments (Testes)

| Método | Rota                                          | Permissão                 |
| ------ | --------------------------------------------- | ------------------------- |
| GET    | `/assessments`                                | _(auth)_                  |
| GET    | `/assessments/company`                        | _(auth)_                  |
| GET    | `/assessments/results`                        | _(auth)_                  |
| GET    | `/assessments/results/:id`                    | _(auth)_                  |
| GET    | `/assessments/alerts`                         | _(auth)_                  |
| PUT    | `/assessments/alerts/:id/read`                | _(auth)_                  |
| POST   | `/assessments/results`                        | `answer-assessment`       |
| POST   | `/assessments/questions`                      | `manage-assessments`      |
| PUT    | `/assessments/questions/:id`                  | `manage-assessments`      |
| GET    | `/assessments/:id`                            | `manage-assessments`      |
| POST   | `/assessments`                                | `manage-assessments`      |
| POST   | `/assessments/:assessmentId/analysis/message` | `view-assessment-results` |
| GET    | `/assessments/:id/results/user-filters`       | `view-assessment-results` |
| GET    | `/assessments/:id/results`                    | `view-assessment-results` |
| POST   | `/assessments/feedback/users/:id`             | `view-assessment-results` |
| POST   | `/assessments/feedback/companies/:id`         | `view-assessment-results` |

---

## ACTs (Atos)

| Método | Rota                                                      | Permissão           |
| ------ | --------------------------------------------------------- | ------------------- |
| GET    | `/acts`                                                   | `answer-act`        |
| GET    | `/acts/by-company`                                        | `answer-act`        |
| GET    | `/acts/chapters`                                          | `answer-act`        |
| GET    | `/acts/full-story`                                        | `answer-act`        |
| GET    | `/acts/:id`                                               | `answer-act`        |
| PUT    | `/acts/next`                                              | `answer-act`        |
| POST   | `/acts/message`                                           | `answer-act`        |
| POST   | `/acts/new-chapter`                                       | `answer-act`        |
| POST   | `/acts/chapters/compile`                                  | `answer-act`        |
| PUT    | `/acts/chapters/:actChapterId`                            | `answer-act`        |
| POST   | `/acts/:actChatbotId/analysis/message`                    | `view-act-analysis` |
| GET    | `/acts/:actChatbotId/analysis`                            | `view-act-analysis` |
| GET    | `/acts/:actChatbotId/analysis/summary`                    | `view-act-analysis` |
| GET    | `/acts/:actChatbotId/analysis/report`                     | `view-act-analysis` |
| GET    | `/acts/:actChatbotId/analysis/user-filters`               | `view-act-analysis` |
| GET    | `/acts/:actChatbotId/analysis/factors/:factorId/messages` | `view-act-analysis` |

---

## Companies (Empresas)

| Método | Rota                                 | Permissão                 |
| ------ | ------------------------------------ | ------------------------- |
| GET    | `/companies/:companyId`              | `view-company-users`      |
| GET    | `/companies/:id/feedback`            | `view-assessment-results` |
| POST   | `/companies/users`                   | `manage-company`          |
| POST   | `/companies/users/batch`             | `manage-company`          |
| POST   | `/companies/:id/users/sync/preview`  | `manage-company`          |
| POST   | `/companies/:id/users/sync/execute`  | `manage-company`          |
| GET    | `/companies/:companyId/users`        | `manage-company`          |
| GET    | `/companies/:companyId/users/search` | `manage-company`          |
| GET    | `/companies/:companyId/users/:id`    | `manage-company`          |
| PUT    | `/companies/:companyId/users/:id`    | `manage-company`          |
| DELETE | `/companies/:companyId/users/:id`    | `manage-company`          |

---

## Notifications (Notificações)

| Método | Rota                                  | Permissão |
| ------ | ------------------------------------- | --------- |
| GET    | `/notifications`                      | _(auth)_  |
| GET    | `/notifications/:notificationId`      | _(auth)_  |
| PUT    | `/notifications/:notificationId/read` | _(auth)_  |

---

## Self-Monitoring (Automonitoramento)

| Método | Rota                                              | Permissão |
| ------ | ------------------------------------------------- | --------- |
| GET    | `/self-monitoring`                                | _(auth)_  |
| GET    | `/self-monitoring/results/:selfMonitoringBlockId` | _(auth)_  |

---

## Psychosocial Factors (Fatores Psicossociais)

| Método | Rota                    | Permissão |
| ------ | ----------------------- | --------- |
| GET    | `/psychosocial-factors` | _(auth)_  |

---

## Nationalities (Nacionalidades)

| Método | Rota             | Permissão |
| ------ | ---------------- | --------- |
| GET    | `/nationalities` | —         |

---

## Leads

| Método | Rota     | Permissão |
| ------ | -------- | --------- |
| POST   | `/leads` | —         |

---

## Admin — ACTs

| Método | Rota                                       | Permissão     |
| ------ | ------------------------------------------ | ------------- |
| GET    | `/admin/acts`                              | `manage-acts` |
| GET    | `/admin/acts/by-trail`                     | `manage-acts` |
| GET    | `/admin/acts/:id`                          | `manage-acts` |
| POST   | `/admin/acts`                              | `manage-acts` |
| PUT    | `/admin/acts/:id`                          | `manage-acts` |
| PUT    | `/admin/acts/update-many`                  | `manage-acts` |
| PUT    | `/admin/acts/analysis/factor-associations` | `manage-acts` |
| POST   | `/admin/acts/:id/import-chatbase-chapters` | `manage-acts` |
| POST   | `/admin/acts/:actChatbotId/analysis`       | `manage-acts` |

---

## Admin — Assessments (Testes)

| Método | Rota                                         | Permissão            |
| ------ | -------------------------------------------- | -------------------- |
| GET    | `/admin/assessments`                         | `manage-assessments` |
| GET    | `/admin/assessments/results`                 | `manage-assessments` |
| GET    | `/admin/assessments/results/download-report` | `manage-assessments` |
| GET    | `/admin/assessments/questions/:assessmentId` | `manage-assessments` |
| GET    | `/admin/assessments/ratings/:id`             | `manage-assessments` |
| GET    | `/admin/assessments/:id`                     | `manage-assessments` |
| POST   | `/admin/assessments/duplicate/:id`           | `manage-assessments` |
| PUT    | `/admin/assessments/ratings/:id`             | `manage-assessments` |
| PUT    | `/admin/assessments/:id`                     | `manage-assessments` |

---

## Admin — Companies (Empresas)

| Método | Rota                                         | Permissão        |
| ------ | -------------------------------------------- | ---------------- |
| GET    | `/admin/companies`                           | `manage-company` |
| GET    | `/admin/companies/feedback`                  | `manage-company` |
| POST   | `/admin/companies`                           | `manage-company` |
| PUT    | `/admin/companies/:id`                       | `manage-company` |
| POST   | `/admin/companies/:id/assessments`           | `manage-company` |
| POST   | `/admin/companies/:companyId/feedback/users` | `manage-company` |

---

## Admin — Roles (Perfis)

| Método | Rota                           | Permissão      |
| ------ | ------------------------------ | -------------- |
| GET    | `/admin/roles`                 | `manage-roles` |
| GET    | `/admin/roles/:id`             | `manage-roles` |
| POST   | `/admin/roles`                 | `manage-roles` |
| PUT    | `/admin/roles/:id`             | `manage-roles` |
| DELETE | `/admin/roles/:id`             | `manage-roles` |
| PUT    | `/admin/roles/:id/permissions` | `manage-roles` |
| GET    | `/admin/permissions`           | `manage-roles` |

---

## Admin — Dimensions (Dimensões)

| Método | Rota                                          | Permissão          |
| ------ | --------------------------------------------- | ------------------ |
| GET    | `/admin/dimensions`                           | `manage-dimension` |
| GET    | `/admin/dimensions/:psychologicalDimensionId` | `manage-dimension` |
| POST   | `/admin/dimensions`                           | `manage-dimension` |
| PUT    | `/admin/dimensions/:psychologicalDimensionId` | `manage-dimension` |

---

## Admin — Nationalities (Nacionalidades)

| Método | Rota                       | Permissão              |
| ------ | -------------------------- | ---------------------- |
| GET    | `/admin/nationalities`     | `manage-nationalities` |
| GET    | `/admin/nationalities/:id` | `manage-nationalities` |
| POST   | `/admin/nationalities`     | `manage-nationalities` |
| PUT    | `/admin/nationalities/:id` | `manage-nationalities` |

---

## Admin — Notifications (Notificações)

| Método | Rota                                   | Permissão              |
| ------ | -------------------------------------- | ---------------------- |
| GET    | `/admin/notifications`                 | `manage-notifications` |
| GET    | `/admin/notifications/types`           | `manage-notifications` |
| GET    | `/admin/notifications/types/:id`       | `manage-notifications` |
| POST   | `/admin/notifications`                 | `manage-notifications` |
| POST   | `/admin/notifications/types`           | `manage-notifications` |
| PUT    | `/admin/notifications/:notificationId` | `manage-notifications` |
| PUT    | `/admin/notifications/types/:id`       | `manage-notifications` |
| DELETE | `/admin/notifications/:notificationId` | `manage-notifications` |

---

## Admin — Psychosocial Factors (Fatores Psicossociais)

| Método | Rota                              | Permissão                     |
| ------ | --------------------------------- | ----------------------------- |
| GET    | `/admin/psychosocial-factors`     | `manage-psychosocial-factors` |
| GET    | `/admin/psychosocial-factors/:id` | `manage-psychosocial-factors` |
| POST   | `/admin/psychosocial-factors`     | `manage-psychosocial-factors` |
| PUT    | `/admin/psychosocial-factors/:id` | `manage-psychosocial-factors` |
| DELETE | `/admin/psychosocial-factors/:id` | `manage-psychosocial-factors` |

---

## Admin — Self-Monitoring (Automonitoramento)

| Método | Rota                                                       | Permissão                |
| ------ | ---------------------------------------------------------- | ------------------------ |
| GET    | `/admin/self-monitoring`                                   | `manage-self-monitoring` |
| GET    | `/admin/self-monitoring/:id`                               | `manage-self-monitoring` |
| GET    | `/admin/self-monitoring/dimensions/:selfMonitoringBlockId` | `manage-self-monitoring` |
| POST   | `/admin/self-monitoring`                                   | `manage-self-monitoring` |
| PUT    | `/admin/self-monitoring/:id`                               | `manage-self-monitoring` |

---

## Admin — Trails (Trilhas)

| Método | Rota                | Permissão       |
| ------ | ------------------- | --------------- |
| GET    | `/admin/trails`     | `manage-trails` |
| GET    | `/admin/trails/:id` | `manage-trails` |
| POST   | `/admin/trails`     | `manage-trails` |
| PUT    | `/admin/trails/:id` | `manage-trails` |
