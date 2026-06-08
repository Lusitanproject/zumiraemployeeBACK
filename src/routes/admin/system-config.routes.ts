import { Router } from "express";

import { GetSystemConfigController } from "../../controllers/admin/system-config/GetSystemConfigController";
import { UpdateSystemConfigController } from "../../controllers/admin/system-config/UpdateSystemConfigController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminSystemConfigRouter = Router();

/**
 * @swagger
 * /admin/system-config:
 *   get:
 *     summary: "[Admin] Buscar configuração do sistema"
 *     description: "Retorna a configuração global do sistema. Requer permissão `admin-system-config-manage`."
 *     tags: [Admin - System Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuração atual do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/SystemConfig'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminSystemConfigRouter.get(
  "/",
  isAuthenticated,
  requirePermissions("admin-system-config-manage"),
  new GetSystemConfigController().handle,
);

/**
 * @swagger
 * /admin/system-config:
 *   put:
 *     summary: "[Admin] Atualizar configuração do sistema"
 *     description: "Atualiza a configuração global do sistema. Requer permissão `admin-system-config-manage`."
 *     tags: [Admin - System Config]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportUnavailableInstructions
 *             properties:
 *               reportUnavailableInstructions:
 *                 type: string
 *                 description: Instruções exibidas quando o relatório não está disponível
 *                 example: "O relatório ainda não está disponível. Tente novamente mais tarde."
 *     responses:
 *       200:
 *         description: Configuração atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/SystemConfig'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 */
adminSystemConfigRouter.put(
  "/",
  isAuthenticated,
  requirePermissions("admin-system-config-manage"),
  new UpdateSystemConfigController().handle,
);

export { adminSystemConfigRouter };
