import { Router } from "express";

import { FindAllPermissionsController } from "../../controllers/admin/permissions/FindAllPermissionsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminPermissionRouter = Router();

/**
 * @swagger
 * /admin/permissions:
 *   get:
 *     summary: "[Admin] Listar permissões disponíveis"
 *     description: >
 *       Retorna todas as permissões cadastradas no sistema.
 *       Permissões são strings que controlam o acesso a funcionalidades específicas (ex: "manage-users", "read-assessment").
 *       Use este endpoint para popular seletores ao configurar permissões de papéis via `PUT /admin/roles/:id/permissions`.
 *       Requer permissão `manage-roles`.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permissões disponíveis
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
 *                     type: string
 *                   example: ["manage-users", "manage-roles", "read-assessment", "answer-assessment", "manage-company"]
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminPermissionRouter.get("/", isAuthenticated, requirePermissions(["manage-roles"]), new FindAllPermissionsController().handle);

export { adminPermissionRouter };
