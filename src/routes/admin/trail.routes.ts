import { Router } from "express";

import { CreateTrailController } from "../../controllers/admin/trails/CreateTrailController";
import { FindAllTrailsController } from "../../controllers/admin/trails/FindAllTrailsController";
import { FindTrailController } from "../../controllers/admin/trails/FindTrailController";
import { SetTrailActsController } from "../../controllers/admin/trails/SetTrailActsController";
import { UpdateTrailController } from "../../controllers/admin/trails/UpdateTrailController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminTrailRouter = Router();

/**
 * @swagger
 * /admin/trails:
 *   post:
 *     summary: "[Admin] Criar trilha"
 *     description: >
 *       Cria uma nova trilha/programa de intervenção.
 *       Trilhas agrupam ACTs em sequência e são vinculadas a empresas.
 *       Ao criar uma empresa (`POST /admin/companies`), ela é vinculada a uma trilha, determinando quais ACTs seus colaboradores terão acesso.
 *       Requer permissão `manage-trails`.
 *     tags: [Admin - Trails]
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
 *               - subtitle
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título principal da trilha
 *               subtitle:
 *                 type: string
 *                 description: Subtítulo ou tagline da trilha
 *               description:
 *                 type: string
 *                 description: Descrição detalhada da trilha e seus objetivos
 *     responses:
 *       200:
 *         description: Trilha criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Trail'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminTrailRouter.post(
  "/",
  isAuthenticated,
  requirePermissions("admin-trails-manage"),
  new CreateTrailController().handle,
);

/**
 * @swagger
 * /admin/trails:
 *   get:
 *     summary: "[Admin] Listar trilhas"
 *     description: "Retorna todas as trilhas/programas de intervenção cadastrados no sistema. Requer permissão `manage-trails`."
 *     tags: [Admin - Trails]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de trilhas
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
 *                     $ref: '#/components/schemas/Trail'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminTrailRouter.get(
  "/",
  isAuthenticated,
  requirePermissions("admin-trails-manage"),
  new FindAllTrailsController().handle,
);

/**
 * @swagger
 * /admin/trails/{id}:
 *   get:
 *     summary: "[Admin] Detalhar trilha"
 *     description: "Retorna os dados de uma trilha específica, incluindo os ACTs vinculados. Requer permissão `manage-trails`."
 *     tags: [Admin - Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha
 *     responses:
 *       200:
 *         description: Dados da trilha
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
 *                     - $ref: '#/components/schemas/Trail'
 *                     - type: object
 *                       properties:
 *                         acts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ActChatbot'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminTrailRouter.get(
  "/:id",
  isAuthenticated,
  requirePermissions("admin-trails-manage"),
  new FindTrailController().handle,
);

/**
 * @swagger
 * /admin/trails/{id}:
 *   put:
 *     summary: "[Admin] Atualizar trilha"
 *     description: "Atualiza os dados de uma trilha. Todos os campos são opcionais. Requer permissão `manage-trails`."
 *     tags: [Admin - Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trilha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Trail'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminTrailRouter.put(
  "/:id",
  isAuthenticated,
  requirePermissions("admin-trails-manage"),
  new UpdateTrailController().handle,
);

/**
 * @swagger
 * /admin/trails/{trailId}/acts:
 *   put:
 *     summary: "[Admin] Definir atos de uma trilha"
 *     description: >
 *       Substitui completamente a lista de atos associados à trilha (replace, não merge).
 *       Os índices recebidos são normalizados para 0..n-1 contíguos preservando a ordem enviada.
 *       Progressos de usuários cujo ato atual foi removido são recalculados automaticamente:
 *       o usuário é movido para o próximo ato disponível; se não houver, para o anterior.
 *       Requer permissão `admin-trails-manage`.
 *     tags: [Admin - Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acts
 *             properties:
 *               acts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - actChatbotId
 *                     - index
 *                   properties:
 *                     actChatbotId:
 *                       type: string
 *                       format: cuid
 *                     index:
 *                       type: integer
 *                       minimum: 0
 *                       description: Posição desejada (será renormalizada para 0..n-1)
 *     responses:
 *       200:
 *         description: Atos da trilha atualizados com sucesso
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
adminTrailRouter.put(
  "/:trailId/acts",
  isAuthenticated,
  requirePermissions("admin-trails-manage"),
  new SetTrailActsController().handle,
);

export { adminTrailRouter };
