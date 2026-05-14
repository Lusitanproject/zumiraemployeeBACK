"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouter = void 0;
const express_1 = require("express");
const CreateManyUsersForCompanyController_1 = require("../controllers/company/CreateManyUsersForCompanyController");
const CreateUserForCompanyController_1 = require("../controllers/company/CreateUserForCompanyController");
const FindCompanyController_1 = require("../controllers/company/FindCompanyController");
const FindCompanyFeedbackController_1 = require("../controllers/company/FindCompanyFeedbackController");
const SyncUsersExecuteController_1 = require("../controllers/company/SyncUsersExecuteController");
const SyncUsersPreviewController_1 = require("../controllers/company/SyncUsersPreviewController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const companyRouter = (0, express_1.Router)();
exports.companyRouter = companyRouter;
/**
 * @swagger
 * /companies/{companyId}:
 *   get:
 *     summary: Detalhar empresa
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados da empresa
 */
companyRouter.get("/:companyId", isAuthenticated_1.isAuthenticated, new FindCompanyController_1.FindCompanyController().handle);
/**
 * @swagger
 * /companies/users:
 *   post:
 *     summary: Criar usuário na empresa do usuário autenticado
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário criado
 */
companyRouter.post("/users", isAuthenticated_1.isAuthenticated, new CreateUserForCompanyController_1.CreateUserForCompanyController().handle);
/**
 * @swagger
 * /companies/users/batch:
 *   post:
 *     summary: Criar múltiplos usuários na empresa do usuário autenticado
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuários criados
 */
companyRouter.post("/users/batch", isAuthenticated_1.isAuthenticated, new CreateManyUsersForCompanyController_1.CreateManyUsersForCompanyController().handle);
/**
 * @swagger
 * /companies/{id}/feedback:
 *   get:
 *     summary: Buscar feedback da empresa para uma avaliação
 *     description: >
 *       Retorna o feedback consolidado gerado pela IA para a empresa em relação a uma avaliação específica.
 *       O `id` é o ID da empresa. O ID da avaliação deve ser passado como query param `assessmentId`.
 *       O feedback é gerado pelo endpoint `POST /assessments/feedback/companies/:id` e salvo em `CompanyAssessmentFeedback`.
 *     tags: [Companies]
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
 *       - in: query
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da avaliação para buscar o feedback
 *     responses:
 *       200:
 *         description: Feedback consolidado da empresa
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
companyRouter.get("/:id/feedback", isAuthenticated_1.isAuthenticated, new FindCompanyFeedbackController_1.FindCompanyFeedbackController().handle);
/**
 * @swagger
 * /companies/{id}/users/sync/preview:
 *   post:
 *     summary: Preview de sincronização de usuários
 *     description: >
 *       Calcula o que aconteceria ao sincronizar a lista de usuários informada, sem persistir nada.
 *       Identifica usuários a criar, atualizar, sem alterações, conflitos de identidade e erros de validação.
 *       O `customId` é a chave de reconciliação e tem escopo por empresa — empresas diferentes podem usar os mesmos valores.
 *     tags: [Companies]
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
 *               - users
 *             properties:
 *               users:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - customId
 *                     - email
 *                     - name
 *                   properties:
 *                     customId:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                     occupationLevel:
 *                       type: string
 *                     area:
 *                       type: string
 *                     similarExposureGroup:
 *                       type: string
 *                     location:
 *                       type: string
 *                     skinColor:
 *                       type: string
 *                     hasDisability:
 *                       type: boolean
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     admissionDate:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE, OTHER]
 *                     nationalityId:
 *                       type: string
 *                       format: cuid
 *     responses:
 *       200:
 *         description: Preview calculado com sucesso
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
 *                     summary:
 *                       type: object
 *                       properties:
 *                         received:
 *                           type: integer
 *                         toCreate:
 *                           type: integer
 *                         toUpdate:
 *                           type: integer
 *                         unchanged:
 *                           type: integer
 *                         conflicts:
 *                           type: integer
 *                         errors:
 *                           type: integer
 *                     creates:
 *                       type: array
 *                       items:
 *                         type: object
 *                     updates:
 *                       type: array
 *                       items:
 *                         type: object
 *                     unchanged:
 *                       type: array
 *                       items:
 *                         type: object
 *                     conflicts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [CUSTOM_ID_DUPLICATED_IN_DB, EMAIL_ALREADY_USED]
 *                           customId:
 *                             type: string
 *                           email:
 *                             type: string
 *                           conflictingUserId:
 *                             type: string
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
companyRouter.post("/:id/users/sync/preview", isAuthenticated_1.isAuthenticated, new SyncUsersPreviewController_1.SyncUsersPreviewController().handle);
/**
 * @swagger
 * /companies/{id}/users/sync/execute:
 *   post:
 *     summary: Executar sincronização de usuários
 *     description: >
 *       Reprocessa o payload do zero usando o estado atual do banco e executa os creates/updates.
 *       Não depende de nenhum preview anterior — pode haver drift entre preview e execute.
 *       Itens com conflitos ou erros de validação são retornados em `failed` sem interromper os demais.
 *     tags: [Companies]
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
 *               - users
 *             properties:
 *               users:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - customId
 *                     - email
 *                     - name
 *                   properties:
 *                     customId:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                     occupationLevel:
 *                       type: string
 *                     area:
 *                       type: string
 *                     similarExposureGroup:
 *                       type: string
 *                     location:
 *                       type: string
 *                     skinColor:
 *                       type: string
 *                     hasDisability:
 *                       type: boolean
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     admissionDate:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE, OTHER]
 *                     nationalityId:
 *                       type: string
 *                       format: cuid
 *     responses:
 *       200:
 *         description: Sincronização executada
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
 *                     summary:
 *                       type: object
 *                       properties:
 *                         created:
 *                           type: integer
 *                         updated:
 *                           type: integer
 *                         unchanged:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *                     created:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                     updated:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                     unchanged:
 *                       type: array
 *                       items:
 *                         type: object
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customId:
 *                             type: string
 *                           reason:
 *                             type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
companyRouter.post("/:id/users/sync/execute", isAuthenticated_1.isAuthenticated, new SyncUsersExecuteController_1.SyncUsersExecuteController().handle);
