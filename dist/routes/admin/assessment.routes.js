"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAssessmentRouter = void 0;
const express_1 = require("express");
const AssessmentDetailForAdminController_1 = require("../../controllers/assessment/AssessmentDetailForAdminController");
const DuplicateAssessmentController_1 = require("../../controllers/admin/assessments/DuplicateAssessmentController");
const FindAllAssessmentsController_1 = require("../../controllers/admin/assessments/FindAllAssessmentsController");
const FindQuestionByAssessmentController_1 = require("../../controllers/admin/assessments/FindQuestionByAssessmentController");
const FindResultRatingsByAssessmentController_1 = require("../../controllers/admin/assessments/FindResultRatingsByAssessmentController");
const FindResultsFilteredController_1 = require("../../controllers/admin/assessments/FindResultsFilteredController");
const GenerateExcelReportController_1 = require("../../controllers/admin/assessments/GenerateExcelReportController");
const UpdateAssessmentController_1 = require("../../controllers/admin/assessments/UpdateAssessmentController");
const UpdateResultRatingsController_1 = require("../../controllers/admin/assessments/UpdateResultRatingsController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminAssessmentRouter = (0, express_1.Router)();
exports.adminAssessmentRouter = adminAssessmentRouter;
/**
 * @swagger
 * /admin/assessments/results:
 *   get:
 *     summary: "[Admin] Listar resultados filtrados de avaliações"
 *     description: >
 *       Retorna resultados de avaliações com filtros administrativos.
 *       Permite filtrar por empresa, avaliação, período e dados demográficos dos respondentes.
 *     tags: [Admin - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assessmentId
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Filtrar por avaliação específica
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Filtrar por empresa
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do período (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do período (ISO 8601)
 *     responses:
 *       200:
 *         description: Resultados filtrados
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
adminAssessmentRouter.get("/results", isAuthenticated_1.isAuthenticated, new FindResultsFilteredController_1.FindResultsFilteredController().handle);
/**
 * @swagger
 * /admin/assessments/results/download-report:
 *   get:
 *     summary: "[Admin] Baixar relatório Excel de resultados"
 *     description: >
 *       Gera e retorna um arquivo Excel (.xlsx) com os resultados de avaliações.
 *       Aceita os mesmos filtros de `GET /admin/assessments/results`.
 *       A resposta é um arquivo binário com Content-Type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
 *     tags: [Admin - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assessmentId
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Arquivo Excel gerado
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminAssessmentRouter.get("/results/download-report", isAuthenticated_1.isAuthenticated, new GenerateExcelReportController_1.GenerateExcelReportController().handle);
/**
 * @swagger
 * /admin/assessments/questions/{assessmentId}:
 *   get:
 *     summary: "[Admin] Listar perguntas de uma avaliação"
 *     description: Retorna todas as perguntas de uma avaliação específica, ordenadas por `index`, com suas opções de resposta.
 *     tags: [Admin - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Perguntas com opções de resposta
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
 *                     $ref: '#/components/schemas/AssessmentQuestion'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminAssessmentRouter.get("/questions/:assessmentId", isAuthenticated_1.isAuthenticated, new FindQuestionByAssessmentController_1.FindQuestionByAssessmentController().handle);
/**
 * @swagger
 * /admin/assessments/ratings/{id}:
 *   get:
 *     summary: "[Admin] Listar faixas de classificação de risco de uma avaliação"
 *     description: >
 *       Retorna as faixas de risco (`AssessmentResultRating`) de uma avaliação específica.
 *       Cada faixa define um intervalo de score, um nível de risco textual, um perfil psicológico e uma cor hexadecimal para exibição.
 *       O `id` é o ID da avaliação.
 *     tags: [Admin - Assessments]
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
 *         description: Faixas de classificação de risco
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
 *                     $ref: '#/components/schemas/AssessmentResultRating'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminAssessmentRouter.get("/ratings/:id", isAuthenticated_1.isAuthenticated, new FindResultRatingsByAssessmentController_1.FindResultRatingsByAssessmentController().handle);
/**
 * @swagger
 * /admin/assessments/ratings/{id}:
 *   put:
 *     summary: "[Admin] Atualizar faixas de classificação de risco"
 *     description: >
 *       Substitui integralmente as faixas de risco de uma avaliação (operação idempotente: sobrescreve tudo).
 *       O `id` é o ID da avaliação.
 *       Omitir `id` em um item do array cria uma nova faixa; incluir o `id` de uma faixa existente a atualiza.
 *     tags: [Admin - Assessments]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratings
 *             properties:
 *               ratings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - risk
 *                     - profile
 *                     - color
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: Omitir para criar nova faixa; incluir para atualizar existente
 *                     risk:
 *                       type: string
 *                       description: "Rótulo do nível de risco (ex:'Baixo','Moderado','Alto')"
 *                     profile:
 *                       type: string
 *                       description: Descrição do perfil psicológico desta faixa
 *                     color:
 *                       type: string
 *                       pattern: '^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$'
 *                       description: Cor hexadecimal (#RRGGBB ou #RGB) para representação visual
 *                       example: "#FF6B35"
 *     responses:
 *       200:
 *         description: Faixas de risco atualizadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminAssessmentRouter.put("/ratings/:id", isAuthenticated_1.isAuthenticated, new UpdateResultRatingsController_1.UpdateResultRatingsController().handle);
/**
 * @swagger
 * /admin/assessments:
 *   get:
 *     summary: "[Admin] Listar todas as avaliações"
 *     description: Retorna todas as avaliações cadastradas no sistema, independente do flag `public`.
 *     tags: [Admin - Assessments]
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
adminAssessmentRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllAssessmentsController_1.FindAllAssessmentsController().handle);
/**
 * @swagger
 * /admin/assessments/duplicate/{id}:
 *   post:
 *     summary: "[Admin] Duplicar avaliação"
 *     description: >
 *       Cria uma cópia completa de uma avaliação existente, incluindo perguntas, opções de resposta e faixas de risco.
 *       Útil para criar variações de avaliações existentes sem recriar do zero.
 *     tags: [Admin - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação a duplicar
 *     responses:
 *       200:
 *         description: Avaliação duplicada com sucesso
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
adminAssessmentRouter.post("/duplicate/:id", isAuthenticated_1.isAuthenticated, new DuplicateAssessmentController_1.DuplicateAssessmentController().handle);
/**
 * @swagger
 * /admin/assessments/{id}:
 *   get:
 *     summary: "[Admin] Detalhar avaliação (visão admin)"
 *     description: Retorna dados completos de uma avaliação na visão administrativa, incluindo perguntas, opções, faixas de risco e instruções de feedback para IA.
 *     tags: [Admin - Assessments]
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
 *         description: Detalhes completos da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Assessment'
 *                     - type: object
 *                       properties:
 *                         questions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AssessmentQuestion'
 *                         ratings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AssessmentResultRating'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminAssessmentRouter.get("/:id", isAuthenticated_1.isAuthenticated, new AssessmentDetailForAdminController_1.AssessmentDetailForAdminController().handle);
/**
 * @swagger
 * /admin/assessments/{id}:
 *   put:
 *     summary: "[Admin] Atualizar avaliação"
 *     description: >
 *       Atualiza os dados de uma avaliação existente.
 *       `operationType`: SUM = soma dos valores das respostas; AVERAGE = média.
 *       `public: true` disponibiliza a avaliação para qualquer usuário; `false` restringe às empresas vinculadas.
 *     tags: [Admin - Assessments]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - operationType
 *               - nationalityId
 *               - public
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               selfMonitoringBlockId:
 *                 type: string
 *                 format: cuid
 *               userFeedbackInstructions:
 *                 type: string
 *               companyFeedbackInstructions:
 *                 type: string
 *               operationType:
 *                 type: string
 *                 enum: [SUM, AVERAGE]
 *               nationalityId:
 *                 type: string
 *                 format: cuid
 *               public:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminAssessmentRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateAssessmentController_1.UpdateAssessmentController().handle);
