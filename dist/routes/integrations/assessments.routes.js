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
 *     summary: Listar resultados recentes de assessments do usuario
 *     description: Retorna, para o usuario informado, apenas o resultado mais recente de cada assessment ja respondido. Internamente, o sistema agrupa os registros por assessment e mantem o ultimo envio de respostas para montar um historico resumido, sem duplicidades.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono dos resultados que serao listados.
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
 *     summary: Detalhar resultado de um assessment do usuario
 *     description: Busca um resultado especifico de assessment e devolve a visao completa para leitura individual. Internamente, valida se o resultado pertence ao usuario informado e monta os detalhes com respostas, dimensoes psicologicas e dados do assessment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do resultado do assessment que sera detalhado.
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono do resultado. Usado para garantir acesso apenas aos proprios dados.
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
 *     summary: Registrar respostas e criar resultado de assessment
 *     description: Recebe as respostas de um assessment e cria um novo resultado para o usuario informado. Internamente, valida a permissao de resposta, confere se assessment e escolhas enviados sao validos e persiste o resultado para uso em historico e feedbacks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario que esta respondendo o assessment.
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
 *                 description: ID do assessment que sera respondido.
 *                 type: string
 *                 minLength: 1
 *               answers:
 *                 description: Lista de respostas do usuario, uma por pergunta respondida.
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [assessmentQuestionId, assessmentQuestionChoiceId]
 *                   properties:
 *                     assessmentQuestionId:
 *                       description: ID da pergunta do assessment que esta sendo respondida.
 *                       type: string
 *                       format: uuid
 *                     assessmentQuestionChoiceId:
 *                       description: ID da alternativa escolhida para a pergunta informada.
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
 *     summary: Listar assessments disponiveis para o usuario
 *     description: Lista os assessments publicos disponiveis para a empresa do usuario informado. Internamente, aplica as regras de disponibilidade e, quando nationalityId e enviado, considera a versao de conteudo correspondente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario usado para identificar empresa e disponibilidade de assessments.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: nationalityId
 *         description: ID da nacionalidade usada para filtrar a versao do assessment (quando aplicavel).
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
 *     summary: Detalhar assessment para resposta do usuario
 *     description: Retorna o conteudo completo de um assessment para resposta, incluindo perguntas, alternativas e bloco de automonitoramento. Internamente, valida permissao de leitura, verifica elegibilidade do usuario e informa o ultimo preenchimento quando existir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do assessment que sera aberto em detalhes.
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         description: ID do usuario para validar permissao e contexto de acesso ao assessment.
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
 *     summary: Gerar feedback individual de assessment
 *     description: Gera um feedback individual para um assessment especifico com base no historico do usuario. Internamente, consolida os resultados mais recentes do usuario nesse assessment, envia o contexto para a IA e pode sinalizar criacao de alerta conforme o perfil identificado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do assessment usado como base para gerar o feedback individual.
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         description: ID do usuario que recebera o feedback e delimita quais resultados entram na analise.
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
 *     summary: Gerar feedback corporativo de assessment
 *     description: Gera um feedback corporativo para um assessment especifico considerando os resultados recentes da empresa do usuario solicitante. Internamente, agrega dados dos participantes da empresa, identifica padroes coletivos e produz orientacoes em nivel organizacional.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do assessment usado como base para o feedback corporativo.
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         description: ID do usuario solicitante. O sistema usa esse usuario para identificar qual empresa sera analisada.
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
