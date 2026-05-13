import { Router } from "express";

import { CreateCompanyController } from "../../controllers/admin/companies/CreateCompanyController";
import { FindAllCompaniesController } from "../../controllers/admin/companies/FindAllCompaniesController";
import { FindAllFeedbacksController } from "../../controllers/admin/companies/FindAllFeedbacksController";
import { GenerateAllUserFeedbackController } from "../../controllers/admin/companies/GenerateAllUserFeedbackController";
import { SetCompanyAssessmentsController } from "../../controllers/admin/companies/SetCompanyAssessmentsController";
import { UpdateCompanyController } from "../../controllers/admin/companies/UpdateCompanyController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminCompanyRouter = Router();

/**
 * @swagger
 * /admin/companies:
 *   get:
 *     summary: "[Admin] Listar empresas"
 *     description: Retorna todas as empresas participantes cadastradas no sistema.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
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
 *                     companies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminCompanyRouter.get("/", isAuthenticated, new FindAllCompaniesController().handle);

/**
 * @swagger
 * /admin/companies/feedback:
 *   get:
 *     summary: "[Admin] Listar todos os feedbacks de empresas"
 *     description: Retorna todos os feedbacks consolidados gerados por IA para empresas em relação a avaliações.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de feedbacks
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
 *                     $ref: '#/components/schemas/CompanyAssessmentFeedback'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminCompanyRouter.get("/feedback", isAuthenticated, new FindAllFeedbacksController().handle);

/**
 * @swagger
 * /admin/companies:
 *   post:
 *     summary: "[Admin] Criar empresa"
 *     description: >
 *       Cria uma nova empresa participante. Requer permissão `manage-company`.
 *       O `trailId` vincula a empresa a uma trilha/programa de intervenção, determinando quais ACTs e assessments serão disponibilizados.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - trailId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail de contato da empresa
 *               trailId:
 *                 type: string
 *                 format: cuid
 *                 description: ID da trilha/programa de intervenção ao qual a empresa pertencerá
 *     responses:
 *       200:
 *         description: Empresa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminCompanyRouter.post("/", isAuthenticated, new CreateCompanyController().handle);

/**
 * @swagger
 * /admin/companies/{id}:
 *   put:
 *     summary: "[Admin] Atualizar empresa"
 *     description: Atualiza os dados de uma empresa. Todos os campos são opcionais.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               trailId:
 *                 type: string
 *                 format: cuid
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminCompanyRouter.put("/:id", isAuthenticated, new UpdateCompanyController().handle);

/**
 * @swagger
 * /admin/companies/{id}/assessments:
 *   post:
 *     summary: "[Admin] Vincular avaliações a uma empresa"
 *     description: >
 *       Define quais avaliações estão disponíveis para os usuários de uma empresa específica.
 *       Operação idempotente: substitui integralmente as avaliações vinculadas.
 *       Afeta apenas avaliações com `public: false` — avaliações públicas já são visíveis a todos.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assessmentIds
 *             properties:
 *               assessmentIds:
 *                 type: array
 *                 description: IDs das avaliações a vincular à empresa (substitui as existentes)
 *                 items:
 *                   type: string
 *                   format: cuid
 *     responses:
 *       200:
 *         description: Avaliações vinculadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminCompanyRouter.post("/:id/assessments", isAuthenticated, new SetCompanyAssessmentsController().handle);

/**
 * @swagger
 * /admin/companies/{companyId}/feedback/users:
 *   post:
 *     summary: "[Admin] Gerar feedback individual para todos os usuários de uma empresa"
 *     description: >
 *       Enfileira a geração de feedback individual via IA para todos os colaboradores de uma empresa que ainda não possuem feedback.
 *       O processamento é assíncrono — cada usuário recebe o feedback em `AssessmentResult.feedback` ao ser processado.
 *       Retorna `queuedCount` indicando quantos feedbacks foram enfileirados.
 *     tags: [Admin - Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Feedbacks enfileirados
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
 *                     companyId:
 *                       type: string
 *                       format: cuid
 *                     queuedCount:
 *                       type: integer
 *                       description: Quantidade de feedbacks enfileirados para geração
 *                     message:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminCompanyRouter.post(
  "/:companyId/feedback/users",
  isAuthenticated,
  new GenerateAllUserFeedbackController().handle,
);

export { adminCompanyRouter };
