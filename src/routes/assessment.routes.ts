import { Router } from "express";

import { UpdateResultRatingsController } from "../controllers/admin/assessments/UpdateResultRatingsController";
import { ListAlertsController } from "../controllers/alert/ListAlertsController";
import { ReadAlertController } from "../controllers/alert/ReadAlertController";
import { AnalysisMessageController } from "../controllers/assessment/AnalysisMessageController";
import { CreateAssessmentController } from "../controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "../controllers/assessment/CreateQuestionController";
import { CreateResultController } from "../controllers/assessment/CreateResultController";
import { DeleteAssessmentController } from "../controllers/assessment/DeleteAssessmentController";
import { DetailAssessmentController } from "../controllers/assessment/DetailAssessmentController";
import { DetailResultController } from "../controllers/assessment/DetailResultController";
import { FindAssessmentConfigController } from "../controllers/assessment/FindAssessmentConfigController";
import { FindAssessmentsPanelController } from "../controllers/assessment/FindAssessmentsPanelController";
import { GenerateCompanyFeedbackController } from "../controllers/assessment/GenerateCompanyFeedbackController";
import { GenerateUserFeedbackController } from "../controllers/assessment/GenerateUserFeedbackController";
import { GetAssessmentResultUserFiltersController } from "../controllers/assessment/GetAssessmentResultUserFiltersController";
import { ListAssessmentsController } from "../controllers/assessment/ListAssessmentsController";
import { ListCompanyAssessmentsController } from "../controllers/assessment/ListCompanyAssessmentsController";
import { ListReferenceBlocksController } from "../controllers/assessment/ListReferenceBlocksController";
import { ListReferenceDimensionsController } from "../controllers/assessment/ListReferenceDimensionsController";
import { ListReferenceNationalitiesController } from "../controllers/assessment/ListReferenceNationalitiesController";
import { ListResultsController } from "../controllers/assessment/ListResultsController";
import { SearchAssessmentResultsController } from "../controllers/assessment/SearchAssessmentResultsController";
import { UpdateAssessmentController } from "../controllers/assessment/UpdateAssessmentController";
import { UpdateQuestionsController } from "../controllers/assessment/UpdateQuestionsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { requireAssessmentAccess } from "../middlewares/requireAssessmentAccess";
import { requireCompany } from "../middlewares/requireCompany";
import { requirePermissions } from "../middlewares/requirePermissions";
import { requireSameCompany } from "../middlewares/requireSameCompany";
import { ASSESSMENT_AUTHORING_PERMISSIONS } from "../permissions/assessments";

const assessmentRouter = Router();

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
assessmentRouter.get("/results", isAuthenticated, new ListResultsController().handle);

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
assessmentRouter.get("/results/:id", isAuthenticated, new DetailResultController().handle);

/**
 * @swagger
 * /assessments/results:
 *   post:
 *     summary: Responder avaliação
 *     description: >
 *       Registra as respostas do usuário a uma avaliação e calcula o score final.
 *       O score é calculado conforme o `operationType` da avaliação: SUM (soma) ou AVERAGE (média) dos valores das opções escolhidas.
 *       Após o registro, o resultado pode ser classificado numa faixa de risco e gerar alertas automáticos.
 *       Requer permissão `answer-assessment`.
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
assessmentRouter.post(
  "/results",
  isAuthenticated,
  requirePermissions("assessments-engage"),
  new CreateResultController().handle,
);

/**
 * @swagger
 * /assessments/questions:
 *   post:
 *     summary: Criar pergunta de avaliação
 *     deprecated: true
 *     description: >
 *       **Deprecated** — use `PUT /assessments/{id}/questions` (sync em lote, que também cria perguntas novas).
 *       Adiciona uma nova pergunta a uma avaliação existente, vinculada a uma dimensão psicológica.
 *       Requer permissão `admin-assessments-manage`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
// Deprecado: preferir PUT /assessments/:id/questions (sync em lote)
assessmentRouter.post(
  "/questions",
  isAuthenticated,
  requirePermissions("admin-assessments-manage"),
  new CreateQuestionController().handle,
);

/**
 * @swagger
 * /assessments/{id}/questions:
 *   put:
 *     summary: Sincronizar perguntas da avaliação (lote)
 *     description: >
 *       Substitui/reconcilia o conjunto inteiro de perguntas de uma avaliação: itens sem `id` são criados,
 *       itens existentes alterados são atualizados, e os ausentes são removidos (idem para as opções).
 *       Funciona para avaliações da empresa (`assessments-update-company`) ou criadas pelo próprio usuário
 *       (`assessments-update-owned`); avaliações Zumira (sem dono) nunca por aqui. Requer **pelo menos uma** dessas permissões.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: Omitir para criar nova pergunta
 *                     description:
 *                       type: string
 *                     index:
 *                       type: integer
 *                     psychologicalDimensionId:
 *                       type: string
 *                       format: uuid
 *                     choices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             description: Omitir para criar nova opção
 *                           label:
 *                             type: string
 *                           value:
 *                             type: number
 *                           index:
 *                             type: integer
 *     responses:
 *       200:
 *         description: Perguntas sincronizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.put(
  "/:id/questions",
  isAuthenticated,
  requireAssessmentAccess({ company: "assessments-update-company", owned: "assessments-update-owned" }),
  new UpdateQuestionsController().handle,
);

/**
 * @swagger
 * /assessments/{id}/ratings:
 *   put:
 *     summary: Atualizar faixas de classificação de risco
 *     description: >
 *       Substitui integralmente as faixas de risco (`AssessmentResultRating`) de uma avaliação.
 *       Omitir `id` em um item cria nova faixa; incluir atualiza a existente.
 *       Funciona para avaliações da empresa (`assessments-update-company`) ou próprias (`assessments-update-owned`);
 *       avaliações Zumira (sem dono) nunca por aqui. Requer **pelo menos uma** dessas permissões.
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
 *                     risk:
 *                       type: string
 *                     profile:
 *                       type: string
 *                     color:
 *                       type: string
 *                       pattern: '^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$'
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.put(
  "/:id/ratings",
  isAuthenticated,
  requireAssessmentAccess({ company: "assessments-update-company", owned: "assessments-update-owned" }),
  new UpdateResultRatingsController().handle,
);

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
assessmentRouter.get("/alerts", isAuthenticated, new ListAlertsController().handle);

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
assessmentRouter.put("/alerts/:id/read", isAuthenticated, new ReadAlertController().handle);

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
assessmentRouter.get("/", isAuthenticated, new ListAssessmentsController().handle);

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
assessmentRouter.get("/company", isAuthenticated, new ListCompanyAssessmentsController().handle);

/**
 * @swagger
 * /assessments/panel:
 *   get:
 *     summary: Listar avaliações do painel do admin-empresa
 *     description: >
 *       Lista as avaliações exibidas no painel do admin-empresa. O conjunto retornado varia conforme as
 *       permissões do usuário (com deduplicação): `assessments-read-company` adiciona todas as avaliações da
 *       empresa, `assessments-read-owned` adiciona as criadas pelo próprio usuário, e
 *       `assessments-read-platform` adiciona as da Zumira (sem dono). Requer **pelo menos uma** dessas três permissões.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avaliações visíveis no painel do admin-empresa
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/panel",
  isAuthenticated,
  requirePermissions(["assessments-read-company", "assessments-read-owned", "assessments-read-platform"], {
    match: "any",
  }),
  requireCompany,
  new FindAssessmentsPanelController().handle,
);

/**
 * @swagger
 * /assessments/{assessmentId}/analysis/message:
 *   post:
 *     summary: Enviar mensagem à análise de avaliação
 *     description: "Análise por avaliação: requer pelo menos uma de `assessments-read-analysis-company`, `assessments-read-analysis-owned` ou `assessments-read-analysis-platform` (conforme o dono da avaliação), com `companyId` da própria empresa."
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resposta da análise
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.post(
  "/:assessmentId/analysis/message",
  isAuthenticated,
  requireAssessmentAccess({
    idParam: "assessmentId",
    company: "assessments-read-analysis-company",
    owned: "assessments-read-analysis-owned",
    platform: "assessments-read-analysis-platform",
  }),
  requireSameCompany(),
  new AnalysisMessageController().handle,
);

/**
 * @swagger
 * /assessments/{id}/results/user-filters:
 *   get:
 *     summary: Filtros de usuários com resultados da avaliação
 *     description: "Análise por avaliação: requer pelo menos uma de `assessments-read-analysis-company`, `assessments-read-analysis-owned` ou `assessments-read-analysis-platform` (conforme o dono da avaliação), com `companyId` da própria empresa."
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valores distintos por coluna
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/:id/results/user-filters",
  isAuthenticated,
  requireAssessmentAccess({
    company: "assessments-read-analysis-company",
    owned: "assessments-read-analysis-owned",
    platform: "assessments-read-analysis-platform",
  }),
  requireSameCompany(),
  new GetAssessmentResultUserFiltersController().handle,
);

/**
 * @swagger
 * /assessments/{id}/results:
 *   get:
 *     summary: Buscar resultados paginados de uma avaliação
 *     description: "Análise por avaliação: requer pelo menos uma de `assessments-read-analysis-company`, `assessments-read-analysis-owned` ou `assessments-read-analysis-platform` (conforme o dono da avaliação), com `companyId` da própria empresa."
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados paginados
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/:id/results",
  isAuthenticated,
  requireAssessmentAccess({
    company: "assessments-read-analysis-company",
    owned: "assessments-read-analysis-owned",
    platform: "assessments-read-analysis-platform",
  }),
  requireSameCompany(),
  new SearchAssessmentResultsController().handle,
);

/**
 * @swagger
 * /assessments/{id}:
 *   get:
 *     summary: Detalhar avaliação (com perguntas e opções)
 *     description: >
 *       Retorna os dados completos de uma avaliação, incluindo todas as perguntas e suas opções de resposta, ordenadas por `index`.
 *       Requer permissão `assessments-engage`.
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
 * /assessments/references/nationalities:
 *   get:
 *     summary: Listar nacionalidades para montagem de avaliações
 *     description: >
 *       Retorna todas as nacionalidades para uso na criação/edição de avaliações.
 *       Requer **pelo menos uma** das permissões de autoria de avaliação
 *       (`assessments-create`, `assessments-update-company` ou `assessments-update-owned`).
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de nacionalidades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Nationality'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/references/nationalities",
  isAuthenticated,
  requirePermissions(ASSESSMENT_AUTHORING_PERMISSIONS, { match: "any" }),
  new ListReferenceNationalitiesController().handle,
);

/**
 * @swagger
 * /assessments/references/self-monitoring-blocks:
 *   get:
 *     summary: Listar blocos de automonitoramento para montagem de avaliações
 *     description: >
 *       Retorna **todos** os blocos de automonitoramento (sem filtrar por avaliações vinculadas),
 *       para uso na criação/edição de avaliações. Requer **pelo menos uma** das permissões de autoria
 *       (`assessments-create`, `assessments-update-company` ou `assessments-update-owned`).
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de blocos de automonitoramento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SelfMonitoringBlock'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/references/self-monitoring-blocks",
  isAuthenticated,
  requirePermissions(ASSESSMENT_AUTHORING_PERMISSIONS, { match: "any" }),
  new ListReferenceBlocksController().handle,
);

/**
 * @swagger
 * /assessments/references/dimensions:
 *   get:
 *     summary: Listar dimensões psicológicas do bloco de uma avaliação
 *     description: >
 *       Retorna as dimensões psicológicas do bloco de automonitoramento salvo na avaliação informada,
 *       para uso na edição/montagem da avaliação. Requer **pelo menos uma** das permissões de autoria
 *       (`assessments-create`, `assessments-update-company` ou `assessments-update-owned`).
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação cujo bloco define as dimensões retornadas
 *     responses:
 *       200:
 *         description: Dimensões psicológicas do bloco da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           acronym:
 *                             type: string
 *                           name:
 *                             type: string
 *       400:
 *         description: Avaliação não existe
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       422:
 *         description: Erro de validação (assessmentId ausente ou inválido)
 */
assessmentRouter.get(
  "/references/dimensions",
  isAuthenticated,
  requirePermissions(ASSESSMENT_AUTHORING_PERMISSIONS, { match: "any" }),
  new ListReferenceDimensionsController().handle,
);

assessmentRouter.get(
  "/:id",
  isAuthenticated,
  requirePermissions("assessments-engage"),
  new DetailAssessmentController().handle,
);

/**
 * @swagger
 * /assessments/{id}/config:
 *   get:
 *     summary: Buscar configuração completa da avaliação
 *     description: >
 *       Retorna a configuração completa para edição num único payload: campos escalares + perguntas/opções +
 *       faixas de risco. Funciona para avaliações da empresa (`assessments-update-company`) ou criadas pelo
 *       próprio usuário (`assessments-update-owned`); nunca para avaliações Zumira. Requer **pelo menos uma** dessas permissões.
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
 *     responses:
 *       200:
 *         description: Configuração completa da avaliação
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.get(
  "/:id/config",
  isAuthenticated,
  requireAssessmentAccess({ company: "assessments-update-company", owned: "assessments-update-owned" }),
  new FindAssessmentConfigController().handle,
);

/**
 * @swagger
 * /assessments/{id}:
 *   put:
 *     summary: Atualizar avaliação
 *     description: >
 *       Atualiza uma avaliação da empresa (`assessments-update-company`) ou criada pelo próprio usuário
 *       (`assessments-update-owned`). Avaliações Zumira (sem dono) nunca podem ser editadas por aqui.
 *       Requer **pelo menos uma** dessas permissões.
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.put(
  "/:id",
  isAuthenticated,
  requireAssessmentAccess({ company: "assessments-update-company", owned: "assessments-update-owned" }),
  new UpdateAssessmentController().handle,
);

/**
 * @swagger
 * /assessments/{id}:
 *   delete:
 *     summary: Deletar avaliação
 *     description: >
 *       Deleta uma avaliação da empresa (`assessments-delete-company`) ou criada pelo próprio usuário
 *       (`assessments-delete-owned`). Avaliações Zumira (sem dono) nunca podem ser deletadas por aqui.
 *       Requer **pelo menos uma** dessas permissões.
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
 *     responses:
 *       200:
 *         description: Avaliação deletada com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.delete(
  "/:id",
  isAuthenticated,
  requireAssessmentAccess({ company: "assessments-delete-company", owned: "assessments-delete-owned" }),
  new DeleteAssessmentController().handle,
);

/**
 * @swagger
 * /assessments:
 *   post:
 *     summary: Criar avaliação
 *     description: >
 *       Cria um novo template de avaliação psicossocial vinculado à empresa do usuário autenticado
 *       (`companyId`/`ownerId` setados a partir do token).
 *       `operationType` define a fórmula de score: `SUM` = soma dos valores das respostas; `AVERAGE` = média.
 *       `public: true` disponibiliza a avaliação para qualquer usuário do sistema; `false` restringe às empresas vinculadas manualmente.
 *       Requer permissão `assessments-create`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
assessmentRouter.post(
  "/",
  isAuthenticated,
  requirePermissions("assessments-create"),
  requireCompany,
  new CreateAssessmentController().handle,
);

/**
 * @swagger
 * /assessments/feedback/users/{id}:
 *   post:
 *     summary: Gerar feedback individual para usuário
 *     description: >
 *       Dispara a geração de feedback textual via IA para o resultado de avaliação indicado por `id`.
 *       O feedback é gerado com base nas `userFeedbackInstructions` da avaliação e nas respostas do usuário.
 *       O texto gerado é salvo no campo `feedback` do `AssessmentResult`.
 *       O `id` é o `AssessmentResult.id`. Requer pelo menos uma de `assessments-read-analysis-company`,
 *       `assessments-read-analysis-owned` ou `assessments-read-analysis-platform`, com `companyId` da própria empresa.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
assessmentRouter.post(
  "/feedback/users/:id",
  isAuthenticated,
  requirePermissions(
    ["assessments-read-analysis-company", "assessments-read-analysis-owned", "assessments-read-analysis-platform"],
    { match: "any" },
  ),
  requireSameCompany(),
  new GenerateUserFeedbackController().handle,
);

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
 *       Análise por avaliação: requer pelo menos uma de `assessments-read-analysis-company`,
 *       `assessments-read-analysis-owned` ou `assessments-read-analysis-platform` (conforme o dono da avaliação), com `companyId` da própria empresa.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
assessmentRouter.post(
  "/feedback/companies/:id",
  isAuthenticated,
  requireAssessmentAccess({
    company: "assessments-read-analysis-company",
    owned: "assessments-read-analysis-owned",
    platform: "assessments-read-analysis-platform",
  }),
  requireSameCompany(),
  new GenerateCompanyFeedbackController().handle,
);

export { assessmentRouter };
