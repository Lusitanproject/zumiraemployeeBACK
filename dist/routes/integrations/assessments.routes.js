"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationAssessmentsRoutes = void 0;
const express_1 = require("express");
const CreateResultController_1 = require("../../controllers/integration/assessment/CreateResultController");
const DetailAssessmentController_1 = require("../../controllers/integration/assessment/DetailAssessmentController");
const DetailResultController_1 = require("../../controllers/integration/assessment/DetailResultController");
const GenerateCompanyFeedbackController_1 = require("../../controllers/integration/assessment/GenerateCompanyFeedbackController");
const GenerateUserFeedbackController_1 = require("../../controllers/integration/assessment/GenerateUserFeedbackController");
const ListAssessmentsController_1 = require("../../controllers/integration/assessment/ListAssessmentsController");
const ListResultsController_1 = require("../../controllers/integration/assessment/ListResultsController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const integrationAssessmentsRoutes = (0, express_1.Router)();
exports.integrationAssessmentsRoutes = integrationAssessmentsRoutes;
/**
 * @swagger
 * /integrations/assessments/results:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/assessments/results
 *     description: Valida query.userId e retorna a lista de resultados mais recentes por assessment para esse usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [items]
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, userId, assessmentId, createdAt, updatedAt, assessment]
 *                         properties:
 *                           id: { type: string }
 *                           feedback:
 *                             type: string
 *                             nullable: true
 *                           assessmentResultRatingId:
 *                             type: string
 *                             nullable: true
 *                           userId: { type: string }
 *                           assessmentId: { type: string }
 *                           createdAt: { type: string, format: date-time }
 *                           updatedAt: { type: string, format: date-time }
 *                           assessment:
 *                             type: object
 *                             required: [id, title, summary]
 *                             properties:
 *                               id: { type: string }
 *                               title: { type: string }
 *                               summary:
 *                                 type: string
 *                                 nullable: true
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.get("/results", isAuthenticated_1.isAuthenticated, new ListResultsController_1.IntegrationListResultsController().handle);
/**
 * @swagger
 * /integrations/assessments/results/{id}:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/assessments/results/{id}
 *     description: Valida params.id e query.userId e retorna o detalhamento do resultado do assessment informado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [id, feedback, assessment, assessmentQuestionAnswers, createdAt, psychologicalDimensions]
 *                   properties:
 *                     id: { type: string }
 *                     feedback:
 *                       type: string
 *                       nullable: true
 *                     assessmentResultRating:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         risk: { type: string }
 *                         profile: { type: string }
 *                         color: { type: string }
 *                     assessment:
 *                       type: object
 *                       required: [id, title, summary, description, selfMonitoringBlock]
 *                       properties:
 *                         id: { type: string }
 *                         title: { type: string }
 *                         summary:
 *                           type: string
 *                           nullable: true
 *                         description:
 *                           type: string
 *                           nullable: true
 *                         nationality:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             name: { type: string }
 *                             acronym: { type: string }
 *                         selfMonitoringBlock:
 *                           type: object
 *                           required: [id, icon, title, psychologicalDimensions]
 *                           properties:
 *                             id: { type: string }
 *                             icon:
 *                               type: string
 *                               nullable: true
 *                             title: { type: string }
 *                             summary:
 *                               type: string
 *                               nullable: true
 *                             psychologicalDimensions:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 required: [acronym, name]
 *                                 properties:
 *                                   acronym: { type: string }
 *                                   name: { type: string }
 *                     assessmentQuestionAnswers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [assessmentQuestionChoice, assessmentQuestion]
 *                         properties:
 *                           assessmentQuestionChoice:
 *                             type: object
 *                             required: [label, value, index]
 *                             properties:
 *                               label: { type: string }
 *                               value: { type: number }
 *                               index: { type: integer }
 *                           assessmentQuestion:
 *                             type: object
 *                             required: [description, index, psychologicalDimension]
 *                             properties:
 *                               description: { type: string }
 *                               index: { type: integer }
 *                               psychologicalDimension:
 *                                 type: object
 *                                 required: [name, acronym]
 *                                 properties:
 *                                   name: { type: string }
 *                                   acronym: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                     psychologicalDimensions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [name, acronym]
 *                         properties:
 *                           name: { type: string }
 *                           acronym: { type: string }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.get("/results/:id", isAuthenticated_1.isAuthenticated, new DetailResultController_1.IntegrationDetailResultController().handle);
/**
 * @swagger
 * /integrations/assessments/results:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/assessments/results
 *     description: Requer permissao answer-assessment, valida query.userId e body (assessmentId, answers) e cria um novo resultado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assessmentId, answers]
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 minLength: 1
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [assessmentQuestionId, assessmentQuestionChoiceId]
 *                   properties:
 *                     assessmentQuestionId:
 *                       type: string
 *                       format: uuid
 *                     assessmentQuestionChoiceId:
 *                       type: string
 *                       format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [id, userId, assessmentId]
 *                   properties:
 *                     id: { type: string }
 *                     userId: { type: string }
 *                     assessmentId: { type: string }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.post("/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.IntegrationCreateResultController().handle);
/**
 * @swagger
 * /integrations/assessments:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/assessments
 *     description: Valida query.userId e nationalityId opcional, e retorna assessments publicos disponiveis para a empresa do usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: nationalityId
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [assessments]
 *                   properties:
 *                     assessments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, title, summary, selfMonitoring, lastCompleted]
 *                         properties:
 *                           id: { type: string }
 *                           title: { type: string }
 *                           summary:
 *                             type: string
 *                             nullable: true
 *                           selfMonitoring:
 *                             type: object
 *                             required: [id, title]
 *                             properties:
 *                               id: { type: string }
 *                               title: { type: string }
 *                           lastCompleted:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.get("/", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.IntegrationListAssessmentsController().handle);
/**
 * @swagger
 * /integrations/assessments/{id}:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/assessments/{id}
 *     description: Requer permissao read-assessment, valida params.id e query.userId e retorna o assessment detalhado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [id, title, description, assessmensQuestions, selfMonitoringBlock, nationality, lastCompleted]
 *                   properties:
 *                     id: { type: string }
 *                     title: { type: string }
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     assessmensQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, description, index, assessmentQuestionChoices]
 *                         properties:
 *                           id: { type: string }
 *                           description: { type: string }
 *                           index: { type: integer }
 *                           assessmentQuestionChoices:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required: [id, label, value, index]
 *                               properties:
 *                                 id: { type: string }
 *                                 label: { type: string }
 *                                 value: { type: number }
 *                                 index: { type: integer }
 *                     selfMonitoringBlock:
 *                       type: object
 *                       required: [id, title]
 *                       properties:
 *                         id: { type: string }
 *                         title: { type: string }
 *                         summary:
 *                           type: string
 *                           nullable: true
 *                         icon:
 *                           type: string
 *                           nullable: true
 *                     nationality:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         acronym: { type: string }
 *                         name: { type: string }
 *                     lastCompleted:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.get("/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.IntegrationDetailAssessmentController().handle);
/**
 * @swagger
 * /integrations/assessments/feedback/users/{id}:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/assessments/feedback/users/{id}
 *     description: Valida params.id e query.userId, gera feedback individual via IA e pode criar alerta conforme perfil identificado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [feedback, identifiedProfile, generateAlert]
 *                   properties:
 *                     feedback: { type: string }
 *                     identifiedProfile: { type: string }
 *                     generateAlert: { type: boolean }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.post("/feedback/users/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_1.IntegrationGenerateUserFeedbackController().handle);
/**
 * @swagger
 * /integrations/assessments/feedback/companies/{id}:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/assessments/feedback/companies/{id}
 *     description: Valida params.id e query.userId, agrega resultados mais recentes da empresa e gera feedback corporativo via IA.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [id, text, companyId, assessmentId]
 *                   properties:
 *                     id: { type: string }
 *                     text: { type: string }
 *                     companyId: { type: string }
 *                     assessmentId: { type: string }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationAssessmentsRoutes.post("/feedback/companies/:id", isAuthenticated_1.isAuthenticated, new GenerateCompanyFeedbackController_1.IntegrationGenerateCompanyFeedbackController().handle);
