"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouter = void 0;
const express_1 = require("express");
const CreateManyUsersForCompanyController_1 = require("../controllers/company/CreateManyUsersForCompanyController");
const CreateUserForCompanyController_1 = require("../controllers/company/CreateUserForCompanyController");
const FindCompanyController_1 = require("../controllers/company/FindCompanyController");
const FindCompanyFeedbackController_1 = require("../controllers/company/FindCompanyFeedbackController");
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
