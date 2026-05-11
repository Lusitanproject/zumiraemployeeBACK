"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationRouter = void 0;
const express_1 = require("express");
const CompileActChapterController_1 = require("../controllers/integration/act/CompileActChapterController");
const CreateActChapterController_1 = require("../controllers/integration/act/CreateActChapterController");
const GetActChapterController_1 = require("../controllers/integration/act/GetActChapterController");
const GetActsDataController_1 = require("../controllers/integration/act/GetActsDataController");
const GetFullStoryController_1 = require("../controllers/integration/act/GetFullStoryController");
const MessageActChatbotController_1 = require("../controllers/integration/act/MessageActChatbotController");
const MoveToNextActController_1 = require("../controllers/integration/act/MoveToNextActController");
const UpdateActChapterController_1 = require("../controllers/integration/act/UpdateActChapterController");
const CreateResultController_1 = require("../controllers/integration/assessment/CreateResultController");
const DetailAssessmentController_1 = require("../controllers/integration/assessment/DetailAssessmentController");
const DetailResultController_1 = require("../controllers/integration/assessment/DetailResultController");
const GenerateCompanyFeedbackController_1 = require("../controllers/integration/assessment/GenerateCompanyFeedbackController");
const GenerateUserFeedbackController_1 = require("../controllers/integration/assessment/GenerateUserFeedbackController");
const ListAssessmentsController_1 = require("../controllers/integration/assessment/ListAssessmentsController");
const ListResultsController_1 = require("../controllers/integration/assessment/ListResultsController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const integrationRouter = (0, express_1.Router)();
exports.integrationRouter = integrationRouter;
/**
 * @swagger
 * /integrations/assessments/results:
 *   get:
 *     summary: "[Integração] Listar resultados de avaliações"
 *     description: >
 *       Versão de integração de `GET /assessments/results`.
 *       Retorna os resultados de avaliações do usuário autenticado via token de integração.
 *       Destinado a integrações externas (ex: plataformas de RH, sistemas de benefícios).
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de resultados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AssessmentResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.get("/assessments/results", isAuthenticated_1.isAuthenticated, new ListResultsController_1.IntegrationListResultsController().handle);
/**
 * @swagger
 * /integrations/assessments/results/{id}:
 *   get:
 *     summary: "[Integração] Detalhar resultado de avaliação"
 *     description: Versão de integração de `GET /assessments/results/:id`. Retorna detalhes de um resultado específico via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do resultado de avaliação
 *     responses:
 *       200:
 *         description: Detalhes do resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/AssessmentResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
integrationRouter.get("/assessments/results/:id", isAuthenticated_1.isAuthenticated, new DetailResultController_1.IntegrationDetailResultController().handle);
/**
 * @swagger
 * /integrations/assessments/results:
 *   post:
 *     summary: "[Integração] Responder avaliação"
 *     description: >
 *       Versão de integração de `POST /assessments/results`.
 *       Registra as respostas de um usuário via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assessmentId
 *               - answers
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 format: cuid
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - assessmentQuestionId
 *                     - assessmentQuestionChoiceId
 *                   properties:
 *                     assessmentQuestionId:
 *                       type: string
 *                       format: uuid
 *                     assessmentQuestionChoiceId:
 *                       type: string
 *                       format: uuid
 *     responses:
 *       200:
 *         description: Resultado registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/AssessmentResult'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.post("/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.IntegrationCreateResultController().handle);
/**
 * @swagger
 * /integrations/assessments:
 *   get:
 *     summary: "[Integração] Listar avaliações disponíveis"
 *     description: Versão de integração de `GET /assessments`. Retorna avaliações disponíveis para o usuário via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assessment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.get("/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.IntegrationListAssessmentsController().handle);
/**
 * @swagger
 * /integrations/assessments/{id}:
 *   get:
 *     summary: "[Integração] Detalhar avaliação"
 *     description: Versão de integração de `GET /assessments/:id`. Retorna detalhes completos de uma avaliação, incluindo perguntas e opções.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Detalhes da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Assessment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
integrationRouter.get("/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.IntegrationDetailAssessmentController().handle);
/**
 * @swagger
 * /integrations/assessments/feedback/users/{id}:
 *   post:
 *     summary: "[Integração] Gerar feedback individual para usuário"
 *     description: >
 *       Versão de integração de `POST /assessments/feedback/users/:id`.
 *       O `id` é o ID do `AssessmentResult`. Dispara a geração de feedback via IA para o resultado indicado.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do resultado de avaliação (`AssessmentResult.id`)
 *     responses:
 *       200:
 *         description: Feedback gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
integrationRouter.post("/assessments/feedback/users/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_1.IntegrationGenerateUserFeedbackController().handle);
/**
 * @swagger
 * /integrations/assessments/feedback/companies/{id}:
 *   post:
 *     summary: "[Integração] Gerar feedback consolidado para empresa"
 *     description: >
 *       Versão de integração de `POST /assessments/feedback/companies/:id`.
 *       O `id` é o ID da avaliação (`Assessment.id`). Gera feedback consolidado para a empresa via IA.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Feedback da empresa gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/CompanyAssessmentFeedback'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.post("/assessments/feedback/companies/:id", isAuthenticated_1.isAuthenticated, new GenerateCompanyFeedbackController_1.IntegrationGenerateCompanyFeedbackController().handle);
/**
 * @swagger
 * /integrations/acts:
 *   get:
 *     summary: "[Integração] Listar ACTs da trilha do usuário"
 *     description: Versão de integração de `GET /acts`. Retorna os ACTs disponíveis para o usuário autenticado via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ACTs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActChatbot'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.get("/acts", isAuthenticated_1.isAuthenticated, new GetActsDataController_1.IntegrationGetActsDataController().handle);
/**
 * @swagger
 * /integrations/acts/chapters:
 *   get:
 *     summary: "[Integração] Buscar capítulo de ACT com mensagens"
 *     description: Versão de integração de `GET /acts/chapters`. Retorna capítulo e histórico de mensagens via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do capítulo
 *     responses:
 *       200:
 *         description: Capítulo com mensagens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
integrationRouter.get("/acts/chapters", isAuthenticated_1.isAuthenticated, new GetActChapterController_1.IntegrationGetActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/full-story:
 *   get:
 *     summary: "[Integração] Obter história completa compilada"
 *     description: Versão de integração de `GET /acts/full-story`. Retorna a narrativa compilada de todos os capítulos do usuário via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Narrativa completa compilada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.get("/acts/full-story", isAuthenticated_1.isAuthenticated, new GetFullStoryController_1.IntegrationGetFullStoryController().handle);
/**
 * @swagger
 * /integrations/acts/next:
 *   put:
 *     summary: "[Integração] Avançar para o próximo ACT"
 *     description: Versão de integração de `PUT /acts/next`. Avança o usuário para o próximo ACT na trilha via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário avançado para o próximo ACT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.put("/acts/next", isAuthenticated_1.isAuthenticated, new MoveToNextActController_1.IntegrationMoveToNextActController().handle);
/**
 * @swagger
 * /integrations/acts/message:
 *   post:
 *     summary: "[Integração] Enviar mensagem ao chatbot"
 *     description: Versão de integração de `POST /acts/message`. Envia mensagem ao chatbot e retorna resposta da IA via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChapterId
 *               - content
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 format: cuid
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resposta do chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapterMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.post("/acts/message", isAuthenticated_1.isAuthenticated, new MessageActChatbotController_1.IntegrationMessageActChatbotController().handle);
/**
 * @swagger
 * /integrations/acts/new-chapter:
 *   post:
 *     summary: "[Integração] Criar novo capítulo de ACT"
 *     description: Versão de integração de `POST /acts/new-chapter`. Inicia um novo capítulo para o usuário via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChatbotId
 *               - type
 *             properties:
 *               actChatbotId:
 *                 type: string
 *                 format: cuid
 *               type:
 *                 type: string
 *                 enum: [REGULAR, ADMIN_TEST]
 *     responses:
 *       200:
 *         description: Capítulo criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.post("/acts/new-chapter", isAuthenticated_1.isAuthenticated, new CreateActChapterController_1.IntegrationCreateActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/chapters/compile:
 *   post:
 *     summary: "[Integração] Compilar capítulo de ACT"
 *     description: Versão de integração de `POST /acts/chapters/compile`. Compila o capítulo via IA via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChapterId
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 format: cuid
 *     responses:
 *       200:
 *         description: Capítulo compilado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.post("/acts/chapters/compile", isAuthenticated_1.isAuthenticated, new CompileActChapterController_1.IntegrationCompileActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/chapters/{actChapterId}:
 *   put:
 *     summary: "[Integração] Atualizar capítulo de ACT"
 *     description: Versão de integração de `PUT /acts/chapters/:actChapterId`. Atualiza título ou compilação de um capítulo via token de integração.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               compilation:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Capítulo atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
integrationRouter.put("/acts/chapters/:actChapterId", isAuthenticated_1.isAuthenticated, new UpdateActChapterController_1.IntegrationUpdateActChapterController().handle);
