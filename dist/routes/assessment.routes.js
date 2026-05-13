"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentRouter = void 0;
const express_1 = require("express");
const ListAlertsController_1 = require("../controllers/alert/ListAlertsController");
const ReadAlertController_1 = require("../controllers/alert/ReadAlertController");
const CreateAssessmentController_1 = require("../controllers/assessment/CreateAssessmentController");
const GetAssessmentResultUserFiltersController_1 = require("../controllers/assessment/GetAssessmentResultUserFiltersController");
const SearchAssessmentResultsController_1 = require("../controllers/assessment/SearchAssessmentResultsController");
const CreateQuestionController_1 = require("../controllers/assessment/CreateQuestionController");
const CreateResultController_1 = require("../controllers/assessment/CreateResultController");
const DetailAssessmentController_1 = require("../controllers/assessment/DetailAssessmentController");
const DetailResultController_1 = require("../controllers/assessment/DetailResultController");
const GenerateCompanyFeedbackController_1 = require("../controllers/assessment/GenerateCompanyFeedbackController");
const GenerateUserFeedbackController_1 = require("../controllers/assessment/GenerateUserFeedbackController");
const ListAssessmentsController_1 = require("../controllers/assessment/ListAssessmentsController");
const ListCompanyAssessmentsController_1 = require("../controllers/assessment/ListCompanyAssessmentsController");
const ListResultsController_1 = require("../controllers/assessment/ListResultsController");
const UpdateQuestionsController_1 = require("../controllers/assessment/UpdateQuestionsController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const assessmentRouter = (0, express_1.Router)();
exports.assessmentRouter = assessmentRouter;
/**
 * @swagger
 * /assessments/results:
 *   get:
 *     summary: Listar resultados do usuário autenticado
 *     description: Retorna todos os resultados de avaliações do usuário autenticado, incluindo feedback individual e classificação de risco quando disponíveis.
 *     tags: [Assessments]
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
assessmentRouter.get("/results", isAuthenticated_1.isAuthenticated, new ListResultsController_1.ListResultsController().handle);
/**
 * @swagger
 * /assessments/results/{id}:
 *   get:
 *     summary: Detalhar resultado de avaliação
 *     description: Retorna os detalhes completos de um resultado específico, incluindo as respostas dadas, o feedback gerado e a classificação de risco.
 *     tags: [Assessments]
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
assessmentRouter.get("/results/:id", isAuthenticated_1.isAuthenticated, new DetailResultController_1.DetailResultController().handle);
/**
 * @swagger
 * /assessments/results:
 *   post:
 *     summary: Responder avaliação
 *     description: >
 *       Registra as respostas do usuário a uma avaliação e calcula o score final.
 *       O score é calculado conforme o `operationType` da avaliação: SUM (soma) ou AVERAGE (média) dos valores das opções escolhidas.
 *       Após o registro, o resultado pode ser classificado numa faixa de risco e gerar alertas automáticos.
 *     tags: [Assessments]
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
 *                 description: ID da avaliação sendo respondida
 *               answers:
 *                 type: array
 *                 description: Lista de respostas — uma por pergunta da avaliação
 *                 items:
 *                   type: object
 *                   required:
 *                     - assessmentQuestionId
 *                     - assessmentQuestionChoiceId
 *                   properties:
 *                     assessmentQuestionId:
 *                       type: string
 *                       format: uuid
 *                       description: ID da pergunta respondida
 *                     assessmentQuestionChoiceId:
 *                       type: string
 *                       format: uuid
 *                       description: ID da opção selecionada pelo usuário
 *     responses:
 *       200:
 *         description: Resultado registrado com sucesso
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.post("/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.CreateResultController().handle);
/**
 * @swagger
 * /assessments/questions:
 *   post:
 *     summary: Criar pergunta de avaliação
 *     description: Adiciona uma nova pergunta a uma avaliação existente, vinculada a uma dimensão psicológica.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - assessmentId
 *               - psychologicalDimensionId
 *             properties:
 *               description:
 *                 type: string
 *                 description: Texto da pergunta exibido ao usuário
 *               index:
 *                 type: integer
 *                 description: Posição de ordenação (0-based) dentro da avaliação
 *               assessmentId:
 *                 type: string
 *                 format: cuid
 *               psychologicalDimensionId:
 *                 type: string
 *                 format: uuid
 *                 description: Dimensão psicológica que esta pergunta mede
 *               choices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                       description: Valor numérico usado no cálculo do score
 *                     index:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Pergunta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/AssessmentQuestion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
assessmentRouter.post("/questions", isAuthenticated_1.isAuthenticated, new CreateQuestionController_1.CreateQuestionController().handle);
/**
 * @swagger
 * /assessments/questions/{id}:
 *   put:
 *     summary: Atualizar pergunta de avaliação
 *     description: Atualiza os dados de uma pergunta existente, incluindo texto, ordenação e opções de resposta.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da pergunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               index:
 *                 type: integer
 *               psychologicalDimensionId:
 *                 type: string
 *                 format: uuid
 *               choices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: Omitir para criar nova opção
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                     index:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Pergunta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
assessmentRouter.put("/questions/:id", isAuthenticated_1.isAuthenticated, new UpdateQuestionsController_1.UpdateQuestionsController().handle);
/**
 * @swagger
 * /assessments/alerts:
 *   get:
 *     summary: Listar alertas do usuário
 *     description: >
 *       Retorna alertas gerados a partir dos resultados de avaliação do usuário autenticado.
 *       Alertas são criados automaticamente quando o resultado é classificado numa faixa de risco elevado.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [recent, unread]
 *         description: "recent = últimos alertas (ordenados por data); unread = somente alertas não lidos"
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de alertas a retornar
 *     responses:
 *       200:
 *         description: Lista de alertas
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
 *                     $ref: '#/components/schemas/Alert'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
assessmentRouter.get("/alerts", isAuthenticated_1.isAuthenticated, new ListAlertsController_1.ListAlertsController().handle);
/**
 * @swagger
 * /assessments/alerts/{id}/read:
 *   put:
 *     summary: Marcar alerta como lido
 *     description: Marca um alerta específico do usuário autenticado como lido.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do alerta
 *     responses:
 *       200:
 *         description: Alerta marcado como lido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
assessmentRouter.put("/alerts/:id/read", isAuthenticated_1.isAuthenticated, new ReadAlertController_1.ReadAlertController().handle);
/**
 * @swagger
 * /assessments:
 *   get:
 *     summary: Listar avaliações disponíveis
 *     description: >
 *       Retorna as avaliações disponíveis para o usuário autenticado.
 *       Filtra por nacionalidade quando `nationalityId` é informado, retornando avaliações culturalmente adequadas.
 *       Inclui apenas avaliações `public: true` ou vinculadas à empresa do usuário.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nationalityId
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Filtrar avaliações por nacionalidade (conteúdo localizado por região/cultura)
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
assessmentRouter.get("/", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.ListAssessmentsController().handle);
/**
 * @swagger
 * /assessments/company:
 *   get:
 *     summary: Listar avaliações da empresa do usuário
 *     description: Retorna as avaliações vinculadas à empresa do usuário autenticado (independente do flag `public`).
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações da empresa
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
assessmentRouter.get("/company", isAuthenticated_1.isAuthenticated, new ListCompanyAssessmentsController_1.ListCompanyAssessmentsController().handle);
/**
 * @swagger
 * /assessments/{id}:
 *   get:
 *     summary: Detalhar avaliação (com perguntas e opções)
 *     description: Retorna os dados completos de uma avaliação, incluindo todas as perguntas e suas opções de resposta, ordenadas por `index`.
 *     tags: [Assessments]
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
 *         description: Detalhes da avaliação com perguntas e opções
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /assessments/{id}/results/user-filters:
 *   get:
 *     summary: Filtros de usuários com resultados da avaliação
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valores distintos por coluna
 */
assessmentRouter.get("/:id/results/user-filters", isAuthenticated_1.isAuthenticated, new GetAssessmentResultUserFiltersController_1.GetAssessmentResultUserFiltersController().handle);
/**
 * @swagger
 * /assessments/{id}/results:
 *   get:
 *     summary: Buscar resultados paginados de uma avaliação
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados paginados
 */
assessmentRouter.get("/:id/results", isAuthenticated_1.isAuthenticated, new SearchAssessmentResultsController_1.SearchAssessmentResultsController().handle);
assessmentRouter.get("/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.DetailAssessmentController().handle);
/**
 * @swagger
 * /assessments:
 *   post:
 *     summary: Criar avaliação
 *     description: >
 *       Cria um novo template de avaliação psicossocial.
 *       `operationType` define a fórmula de score: `SUM` = soma dos valores das respostas; `AVERAGE` = média.
 *       `public: true` disponibiliza a avaliação para qualquer usuário do sistema; `false` restringe às empresas vinculadas manualmente.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - selfMonitoringBlockId
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
 *                 description: "Bloco temático ao qual esta avaliação pertence (ex: bloco de 'Saúde Mental')"
 *               userFeedbackInstructions:
 *                 type: string
 *                 description: Prompt de sistema para IA gerar feedback individual ao usuário
 *               companyFeedbackInstructions:
 *                 type: string
 *                 description: Prompt de sistema para IA gerar feedback consolidado para a empresa
 *               operationType:
 *                 type: string
 *                 enum: [SUM, AVERAGE]
 *                 description: "SUM = soma dos valores; AVERAGE = média dos valores"
 *               nationalityId:
 *                 type: string
 *                 format: cuid
 *               public:
 *                 type: boolean
 *                 description: "true = visível para todos; false = restrita a empresas vinculadas"
 *     responses:
 *       200:
 *         description: Avaliação criada com sucesso
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
 */
assessmentRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateAssessmentController_1.CreateAssessmentController().handle);
/**
 * @swagger
 * /assessments/feedback/users/{id}:
 *   post:
 *     summary: Gerar feedback individual para usuário
 *     description: >
 *       Dispara a geração de feedback textual via IA para o resultado de avaliação indicado por `id`.
 *       O feedback é gerado com base nas `userFeedbackInstructions` da avaliação e nas respostas do usuário.
 *       O texto gerado é salvo no campo `feedback` do `AssessmentResult`.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do resultado de avaliação (`AssessmentResult.id`) para o qual gerar o feedback
 *     responses:
 *       200:
 *         description: Feedback gerado e salvo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
assessmentRouter.post("/feedback/users/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_1.GenerateUserFeedbackController().handle);
/**
 * @swagger
 * /assessments/feedback/companies/{id}:
 *   post:
 *     summary: Gerar feedback consolidado para empresa
 *     description: >
 *       Dispara a geração de feedback consolidado via IA para uma empresa em relação a uma avaliação específica.
 *       O `id` refere-se ao ID da avaliação (`Assessment.id`).
 *       O feedback é gerado com base nas `companyFeedbackInstructions` e nos resultados agregados dos colaboradores.
 *       O texto gerado é salvo em `CompanyAssessmentFeedback`.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação para a qual gerar o feedback da empresa
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
assessmentRouter.post("/feedback/companies/:id", isAuthenticated_1.isAuthenticated, new GenerateCompanyFeedbackController_1.GenerateCompanyFeedbackController().handle);
