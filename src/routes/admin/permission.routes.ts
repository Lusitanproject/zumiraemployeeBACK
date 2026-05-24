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
 *       Retorna todas as permissões do sistema agrupadas por domínio, com nome legível para exibição.
 *       Use este endpoint para popular seletores ao configurar permissões de papéis via `PUT /admin/roles/:id/permissions`.
 *       Requer permissão `manage-roles`.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissões agrupadas por domínio
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
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           domain:
 *                             type: string
 *                             example: assessments
 *                           label:
 *                             type: string
 *                             example: Testes
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 key:
 *                                   type: string
 *                                   example: manage-assessments
 *                                 label:
 *                                   type: string
 *                                   example: Gerenciar Testes
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminPermissionRouter.get(
  "/",
  isAuthenticated,
  requirePermissions("admin-roles-manage"),
  new FindAllPermissionsController().handle,
);

export { adminPermissionRouter };
