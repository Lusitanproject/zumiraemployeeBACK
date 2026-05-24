# Rotas de Integração (legado)

Estas rotas foram removidas para reimplementação. Todas ficavam sob o prefixo `/integrations` e exigiam `isAuthenticated`.

---

## Assessment (7 endpoints)

| Método | Path                                               | Permissão           | Descrição                                                             |
| ------ | -------------------------------------------------- | ------------------- | --------------------------------------------------------------------- |
| GET    | `/integrations/assessments/results`                | `read-assessment`   | Listar resultados do usuário autenticado                              |
| GET    | `/integrations/assessments/results/:id`            | `read-assessment`   | Detalhar resultado específico                                         |
| POST   | `/integrations/assessments/results`                | `answer-assessment` | Submeter respostas e criar resultado                                  |
| GET    | `/integrations/assessments`                        | —                   | Listar avaliações disponíveis                                         |
| GET    | `/integrations/assessments/:id`                    | `read-assessment`   | Detalhar avaliação com perguntas e opções                             |
| POST   | `/integrations/assessments/feedback/users/:id`     | —                   | Gerar feedback individual com IA (`id` = `AssessmentResult.id`)       |
| POST   | `/integrations/assessments/feedback/companies/:id` | —                   | Gerar feedback consolidado da empresa com IA (`id` = `Assessment.id`) |

## ACT (8 endpoints)

| Método | Path                                        | Permissão | Descrição                                                                 |
| ------ | ------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| GET    | `/integrations/acts`                        | —         | Listar ACTs da trilha do usuário                                          |
| GET    | `/integrations/acts/chapters?actChapterId=` | —         | Buscar capítulo específico com histórico de mensagens                     |
| GET    | `/integrations/acts/full-story`             | —         | Obter narrativa compilada de todos os capítulos                           |
| PUT    | `/integrations/acts/next`                   | —         | Avançar para o próximo ACT da trilha                                      |
| POST   | `/integrations/acts/message`                | —         | Enviar mensagem ao chatbot do ACT (body: `actChapterId`, `content`)       |
| POST   | `/integrations/acts/new-chapter`            | —         | Iniciar novo capítulo (body: `actChatbotId`, `type: REGULAR\|ADMIN_TEST`) |
| POST   | `/integrations/acts/chapters/compile`       | —         | Compilar capítulo com IA (body: `actChapterId`)                           |
| PUT    | `/integrations/acts/chapters/:actChapterId` | —         | Atualizar título ou compilação do capítulo                                |

---

## Controllers removidos

**Assessment:**

- `src/controllers/integration/assessment/ListResultsController.ts`
- `src/controllers/integration/assessment/DetailResultController.ts`
- `src/controllers/integration/assessment/CreateResultController.ts`
- `src/controllers/integration/assessment/ListAssessmentsController.ts`
- `src/controllers/integration/assessment/DetailAssessmentController.ts`
- `src/controllers/integration/assessment/GenerateUserFeedbackController.ts`
- `src/controllers/integration/assessment/GenerateCompanyFeedbackController.ts`

**ACT:**

- `src/controllers/integration/act/GetActsDataController.ts`
- `src/controllers/integration/act/GetActChapterController.ts`
- `src/controllers/integration/act/GetFullStoryController.ts`
- `src/controllers/integration/act/MoveToNextActController.ts`
- `src/controllers/integration/act/MessageActChatbotController.ts`
- `src/controllers/integration/act/CreateActChapterController.ts`
- `src/controllers/integration/act/CompileActChapterController.ts`
- `src/controllers/integration/act/UpdateActChapterController.ts`

---

## Rota de arquivo removido

- `src/routes/integration.routes.ts`
- Mount em `src/routes/index.ts`: `router.use("/integrations", integrationRouter)`

---

## Conteúdo original da rota (`integration.routes.ts`)

```typescript
integrationRouter.get("/assessments/results", isAuthenticated, new IntegrationListResultsController().handle);
integrationRouter.get("/assessments/results/:id", isAuthenticated, new IntegrationDetailResultController().handle);
integrationRouter.post("/assessments/results", isAuthenticated, new IntegrationCreateResultController().handle);
integrationRouter.get("/assessments", isAuthenticated, new IntegrationListAssessmentsController().handle);
integrationRouter.get("/assessments/:id", isAuthenticated, new IntegrationDetailAssessmentController().handle);
integrationRouter.post(
  "/assessments/feedback/users/:id",
  isAuthenticated,
  new IntegrationGenerateUserFeedbackController().handle,
);
integrationRouter.post(
  "/assessments/feedback/companies/:id",
  isAuthenticated,
  new IntegrationGenerateCompanyFeedbackController().handle,
);

integrationRouter.get("/acts", isAuthenticated, new IntegrationGetActsDataController().handle);
integrationRouter.get("/acts/chapters", isAuthenticated, new IntegrationGetActChapterController().handle);
integrationRouter.get("/acts/full-story", isAuthenticated, new IntegrationGetFullStoryController().handle);
integrationRouter.put("/acts/next", isAuthenticated, new IntegrationMoveToNextActController().handle);
integrationRouter.post("/acts/message", isAuthenticated, new IntegrationMessageActChatbotController().handle);
integrationRouter.post("/acts/new-chapter", isAuthenticated, new IntegrationCreateActChapterController().handle);
integrationRouter.post("/acts/chapters/compile", isAuthenticated, new IntegrationCompileActChapterController().handle);
integrationRouter.put(
  "/acts/chapters/:actChapterId",
  isAuthenticated,
  new IntegrationUpdateActChapterController().handle,
);
```
