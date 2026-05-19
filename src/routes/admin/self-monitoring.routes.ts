import { Router } from "express";

import { FindDimensionByBlockController } from "../../controllers/admin/dimensions/FindBySelfMonitoringController";
import { CreateSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { ListAllSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { FindSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminSelfMonitoringRouter = Router();

/**
 * @swagger
 * /admin/self-monitoring:
 *   get:
 *     summary: "[Admin] Listar blocos de automonitoramento"
 *     description: "Retorna todos os blocos temáticos de automonitoramento cadastrados no sistema. Requer permissão `manage-self-monitoring`."
 *     tags: [Admin - Self-Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de blocos
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
 *                     $ref: '#/components/schemas/SelfMonitoringBlock'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminSelfMonitoringRouter.get("/", isAuthenticated, requirePermissions(["manage-self-monitoring"]), new ListAllSelfMonitoringBlocksController().handle);

/**
 * @swagger
 * /admin/self-monitoring:
 *   post:
 *     summary: "[Admin] Criar bloco de automonitoramento"
 *     description: >
 *       Cria um novo bloco temático de automonitoramento.
 *       Blocos agrupam avaliações e dimensões psicológicas de uma mesma área (ex: 'Saúde Mental', 'Ambiente de Trabalho').
 *       O `icon` é um identificador de ícone para exibição na interface.
 *       Requer permissão `manage-self-monitoring`.
 *     tags: [Admin - Self-Monitoring]
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
 *               - icon
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               summary:
 *                 type: string
 *               icon:
 *                 type: string
 *                 description: "Identificador do ícone para exibição na UI (ex:'brain','heart','chart')"
 *     responses:
 *       200:
 *         description: Bloco criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/SelfMonitoringBlock'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminSelfMonitoringRouter.post("/", isAuthenticated, requirePermissions(["manage-self-monitoring"]), new CreateSelfMonitoringBlocksController().handle);

/**
 * @swagger
 * /admin/self-monitoring/{id}:
 *   put:
 *     summary: "[Admin] Atualizar bloco de automonitoramento"
 *     description: "Atualiza os dados de um bloco de automonitoramento. Todos os campos são opcionais. Requer permissão `manage-self-monitoring`."
 *     tags: [Admin - Self-Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do bloco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bloco atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/SelfMonitoringBlock'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.put("/:id", isAuthenticated, requirePermissions(["manage-self-monitoring"]), new EditSelfMonitoringBlocksController().handle);

/**
 * @swagger
 * /admin/self-monitoring/dimensions/{selfMonitoringBlockId}:
 *   get:
 *     summary: "[Admin] Listar dimensões de um bloco de automonitoramento"
 *     description: "Retorna todas as dimensões psicológicas vinculadas a um bloco específico. Requer permissão `manage-self-monitoring`."
 *     tags: [Admin - Self-Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: selfMonitoringBlockId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do bloco de automonitoramento
 *     responses:
 *       200:
 *         description: Dimensões do bloco
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
 *                     $ref: '#/components/schemas/PsychologicalDimension'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.get("/dimensions/:selfMonitoringBlockId", isAuthenticated, requirePermissions(["manage-self-monitoring"]), new FindDimensionByBlockController().handle);

/**
 * @swagger
 * /admin/self-monitoring/{id}:
 *   get:
 *     summary: "[Admin] Detalhar bloco de automonitoramento"
 *     description: "Retorna os dados de um bloco de automonitoramento específico. Requer permissão `manage-self-monitoring`."
 *     tags: [Admin - Self-Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do bloco
 *     responses:
 *       200:
 *         description: Dados do bloco
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/SelfMonitoringBlock'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.get("/:id", isAuthenticated, requirePermissions(["manage-self-monitoring"]), new FindSelfMonitoringBlocksController().handle);

export { adminSelfMonitoringRouter };
