# Routes Migration: Admin → Normal

All routes below were moved out of the `/admin` prefix.

## Users

| Before | After |
|--------|-------|
| `GET /admin/users/search` | `GET /users/search` |
| `GET /admin/users/filters` | `GET /users/filters` |
| `GET /admin/users/find-by` | `GET /users/find-by` |
| `GET /admin/users/company/:companyId` | `GET /users/company/:companyId` |
| `GET /admin/users` | `GET /users` |
| `GET /admin/users/:userId` | `GET /users/:userId` |
| `PUT /admin/users/:id` | `PUT /users/:id` |
| `DELETE /admin/users/:userId` | `DELETE /users/:userId` |
| `POST /admin/users` | `POST /companies/users` ¹ |
| `POST /admin/users/create-many` | `POST /companies/users/batch` ¹ |

¹ `companyId` is no longer passed in the body — it is automatically resolved from the authenticated requester's company.

## Companies

| Before | After |
|--------|-------|
| `GET /admin/companies/:companyId` | `GET /companies/:companyId` |

## Assessments

| Before | After |
|--------|-------|
| `GET /admin/assessments/:id/results` | `GET /assessments/:id/results` |
| `GET /admin/assessments/:id/results/user-filters` | `GET /assessments/:id/results/user-filters` |

## ACTs

| Before | After |
|--------|-------|
| `GET /admin/acts/by-company` | `GET /acts/by-company` |
| `GET /admin/acts/:id` | `GET /acts/:id` |
| `GET /admin/acts/:actChatbotId/analysis` | `GET /acts/:actChatbotId/analysis` |
| `GET /admin/acts/:actChatbotId/analysis/summary` | `GET /acts/:actChatbotId/analysis/summary` |
| `GET /admin/acts/:actChatbotId/analysis/report` | `GET /acts/:actChatbotId/analysis/report` |
| `GET /admin/acts/:actChatbotId/analysis/user-filters` | `GET /acts/:actChatbotId/analysis/user-filters` |
| `GET /admin/acts/:actChatbotId/analysis/factors/:factorId/messages` | `GET /acts/:actChatbotId/analysis/factors/:factorId/messages` |

## Unchanged (remain admin-only)

The following endpoints were **not** migrated and remain under `/admin`:

- `POST /admin/acts` — create ACT
- `PUT /admin/acts/update-many` — bulk reorder ACTs
- `PUT /admin/acts/:id` — update ACT
- `POST /admin/acts/:id/import-chatbase-chapters` — import from Chatbase
- `POST /admin/acts/:actChatbotId/analysis` — trigger batch analysis (async)
- All `/admin/assessments` endpoints except the two results ones above
- All `/admin/companies` endpoints except the detail one above
- All `/admin/roles` endpoints
- All `/admin/trails` endpoints
