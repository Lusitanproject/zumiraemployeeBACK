# Refatoração de Rotas Admin

Mover todas as rotas que usam controllers de `controllers/admin/` para o prefixo `/admin/*`.

**Único arquivo a modificar:** `src/routes.ts`

---

## Tabela antes/depois

### USERS
| Método | Antes | Depois |
|--------|-------|--------|
| POST | `/users/admin` | `/admin/users` |
| GET | `/users/admin/find-by` | `/admin/users/find-by` |
| PUT | `/users/admin/:id` | `/admin/users/:id` |
| DELETE | `/users/:id` | `/admin/users/:id` |
| GET | `/users` | `/admin/users` |
| GET | `/users/:userId` | `/admin/users/:userId` |
| GET | `/users/company/:companyId` | `/admin/users/company/:companyId` |
| POST | `/users/admin/create-many` | `/admin/users/create-many` |

### ROLES
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/roles` | `/admin/roles` |
| POST | `/roles/admin` | `/admin/roles` |
| PUT | `/roles/admin/:id` | `/admin/roles/:id` |
| DELETE | `/roles/admin/:id` | `/admin/roles/:id` |
| GET | `/roles/admin/:id` | `/admin/roles/:id` |
| PUT | `/roles/admin/:id/permissions` | `/admin/roles/:id/permissions` |

### PERMISSIONS
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/permissions/admin` | `/admin/permissions` |

### DIMENSIONS
| Método | Antes | Depois |
|--------|-------|--------|
| POST | `/dimensions` | `/admin/dimensions` |
| GET | `/dimensions` | `/admin/dimensions` |
| GET | `/dimensions/:psychologicalDimensionId` | `/admin/dimensions/:psychologicalDimensionId` |
| PUT | `/dimensions/:psychologicalDimensionId` | `/admin/dimensions/:psychologicalDimensionId` |

### ASSESSMENTS (admin)
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/assessments/results/admin` | `/admin/assessments/results` |
| GET | `/assessments/results/admin/download-report` | `/admin/assessments/results/download-report` |
| GET | `/assessments/questions/:assessmentId` | `/admin/assessments/questions/:assessmentId` |
| GET | `/assessments/ratings/:id` | `/admin/assessments/ratings/:id` |
| PUT | `/assessments/ratings/:id` | `/admin/assessments/ratings/:id` |
| GET | `/assessments/admin` | `/admin/assessments` |
| GET | `/assessments/admin/:id` | `/admin/assessments/:id` |
| POST | `/assessments/admin/duplicate/:id` | `/admin/assessments/duplicate/:id` |
| PUT | `/assessments/:id` | `/admin/assessments/:id` |

### SELF MONITORING (admin)
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/self-monitoring/admin` | `/admin/self-monitoring` |
| POST | `/self-monitoring/admin` | `/admin/self-monitoring` |
| PUT | `/self-monitoring/admin/:id` | `/admin/self-monitoring/:id` |
| GET | `/self-monitoring/admin/:id` | `/admin/self-monitoring/:id` |
| GET | `/self-monitoring/dimensions/:selfMonitoringBlockId` | `/admin/self-monitoring/dimensions/:selfMonitoringBlockId` |

### PSYCHOSOCIAL FACTORS
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/psychosocial-factors` | `/admin/psychosocial-factors` |
| POST | `/psychosocial-factors` | `/admin/psychosocial-factors` |
| GET | `/psychosocial-factors/:id` | `/admin/psychosocial-factors/:id` |
| PUT | `/psychosocial-factors/:id` | `/admin/psychosocial-factors/:id` |
| DELETE | `/psychosocial-factors/:id` | `/admin/psychosocial-factors/:id` |

### COMPANIES
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/companies` | `/admin/companies` |
| GET | `/companies/feedback` | `/admin/companies/feedback` |
| GET | `/companies/:companyId` | `/admin/companies/:companyId` |
| POST | `/companies/:id/assessments` | `/admin/companies/:id/assessments` |
| POST | `/companies/admin` | `/admin/companies` |
| PUT | `/companies/admin/:id` | `/admin/companies/:id` |
| POST | `/companies/admin/:companyId/acts/:actChatbotId/analysis` | `/admin/companies/:companyId/acts/:actChatbotId/analysis` |
| GET | `/companies/admin/:companyId/acts/:actChatbotId/analysis` | `/admin/companies/:companyId/acts/:actChatbotId/analysis` |
| GET | `/companies/admin/:companyId/acts/:actChatbotId/analysis/factors/:factorId/messages` | `/admin/companies/:companyId/acts/:actChatbotId/analysis/factors/:factorId/messages` |
| POST | `/companies/admin/:companyId/feedback/users` | `/admin/companies/:companyId/feedback/users` |

### NATIONALITIES (admin)
| Método | Antes | Depois |
|--------|-------|--------|
| POST | `/nationalities/admin` | `/admin/nationalities` |
| GET | `/nationalities/admin` | `/admin/nationalities` |
| GET | `/nationalities/admin/:id` | `/admin/nationalities/:id` |
| PUT | `/nationalities/admin/:id` | `/admin/nationalities/:id` |

### NOTIFICATIONS (admin)
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/notifications/admin` | `/admin/notifications` |
| GET | `/notifications/admin/types` | `/admin/notifications/types` |
| GET | `/notifications/admin/types/:id` | `/admin/notifications/types/:id` |
| PUT | `/notifications/:notificationId` | `/admin/notifications/:notificationId` |
| PUT | `/notifications/admin/types/:id` | `/admin/notifications/types/:id` |
| POST | `/notifications` | `/admin/notifications` |
| POST | `/notifications/admin/types` | `/admin/notifications/types` |
| DELETE | `/notifications/:notificationId` | `/admin/notifications/:notificationId` |

### ACTS (admin)
| Método | Antes | Depois |
|--------|-------|--------|
| GET | `/acts/admin` | `/admin/acts` |
| GET | `/acts/admin/by-trail` | `/admin/acts/by-trail` |
| GET | `/acts/admin/by-company` | `/admin/acts/by-company` |
| GET | `/acts/admin/:id` | `/admin/acts/:id` |
| PUT | `/acts/admin/update-many` | `/admin/acts/update-many` |
| PUT | `/acts/admin/:id` | `/admin/acts/:id` |
| POST | `/acts/admin` | `/admin/acts` |
| POST | `/acts/admin/:id/import-chatbase-chapters` | `/admin/acts/:id/import-chatbase-chapters` |

### TRAILS
| Método | Antes | Depois |
|--------|-------|--------|
| POST | `/trails/admin` | `/admin/trails` |
| GET | `/trails/admin` | `/admin/trails` |
| GET | `/trails/admin/:id` | `/admin/trails/:id` |
| PUT | `/trails/admin/:id` | `/admin/trails/:id` |

---

## Rotas que NÃO mudam

- `POST /auth/email`, `POST /auth/verify`
- `POST /users` (criação pública)
- `GET /assessments`, `GET /assessments/company`, `GET /assessments/:id`, `POST /assessments`
- `GET /assessments/results`, `GET /assessments/results/:id`, `POST /assessments/results`
- `POST /assessments/questions`, `PUT /assessments/questions/:id`
- `GET /assessments/alerts`, `PUT /assessments/alerts/:id/read`
- `POST /assessments/feedback/users/:id`, `POST /assessments/feedback/companies/:id`
- `GET /self-monitoring`, `GET /self-monitoring/results/:selfMonitoringBlockId`
- `GET /companies/:id/feedback`
- `GET /nationalities`
- `GET /notifications`, `GET /notifications/:notificationId`, `PUT /notifications/:notificationId/read`
- Todas as rotas `/acts` sem /admin
- Todas as rotas `/integrations/*`
- `POST /leads`
