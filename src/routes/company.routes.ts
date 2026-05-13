import { Router } from "express";

import { CreateManyUsersForCompanyController } from "../controllers/company/CreateManyUsersForCompanyController";
import { CreateUserForCompanyController } from "../controllers/company/CreateUserForCompanyController";
import { FindCompanyController } from "../controllers/company/FindCompanyController";
import { FindCompanyFeedbackController } from "../controllers/company/FindCompanyFeedbackController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const companyRouter = Router();

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
companyRouter.get("/:companyId", isAuthenticated, new FindCompanyController().handle);

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
companyRouter.post("/users", isAuthenticated, new CreateUserForCompanyController().handle);

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
companyRouter.post("/users/batch", isAuthenticated, new CreateManyUsersForCompanyController().handle);

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
companyRouter.get("/:id/feedback", isAuthenticated, new FindCompanyFeedbackController().handle);

export { companyRouter };
