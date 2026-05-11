"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSelfMonitoringRouter = void 0;
const express_1 = require("express");
const FindBySelfMonitoringController_1 = require("../../controllers/admin/dimensions/FindBySelfMonitoringController");
const CreateSelfMonitoringBlockController_1 = require("../../controllers/admin/self-monitoring/CreateSelfMonitoringBlockController");
const EditSelfMonitoringBlockController_1 = require("../../controllers/admin/self-monitoring/EditSelfMonitoringBlockController");
const FindAllSelfMonitoringBlocksController_1 = require("../../controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController");
const FindSelfMonitoringBlockController_1 = require("../../controllers/admin/self-monitoring/FindSelfMonitoringBlockController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminSelfMonitoringRouter = (0, express_1.Router)();
exports.adminSelfMonitoringRouter = adminSelfMonitoringRouter;
/**
 * @swagger
 * /admin/self-monitoring:
 *   get:
 *     summary: "[Admin] Listar blocos de automonitoramento"
 *     description: Retorna todos os blocos temáticos de automonitoramento cadastrados no sistema.
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
 */
adminSelfMonitoringRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllSelfMonitoringBlocksController_1.ListAllSelfMonitoringBlocksController().handle);
/**
 * @swagger
 * /admin/self-monitoring:
 *   post:
 *     summary: "[Admin] Criar bloco de automonitoramento"
 *     description: >
 *       Cria um novo bloco temático de automonitoramento.
 *       Blocos agrupam avaliações e dimensões psicológicas de uma mesma área (ex: 'Saúde Mental', 'Ambiente de Trabalho').
 *       O `icon` é um identificador de ícone para exibição na interface.
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
 */
adminSelfMonitoringRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateSelfMonitoringBlockController_1.CreateSelfMonitoringBlocksController().handle);
/**
 * @swagger
 * /admin/self-monitoring/{id}:
 *   put:
 *     summary: "[Admin] Atualizar bloco de automonitoramento"
 *     description: Atualiza os dados de um bloco de automonitoramento. Todos os campos são opcionais.
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.put("/:id", isAuthenticated_1.isAuthenticated, new EditSelfMonitoringBlockController_1.EditSelfMonitoringBlocksController().handle);
/**
 * @swagger
 * /admin/self-monitoring/dimensions/{selfMonitoringBlockId}:
 *   get:
 *     summary: "[Admin] Listar dimensões de um bloco de automonitoramento"
 *     description: Retorna todas as dimensões psicológicas vinculadas a um bloco específico.
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.get("/dimensions/:selfMonitoringBlockId", isAuthenticated_1.isAuthenticated, new FindBySelfMonitoringController_1.FindDimensionByBlockController().handle);
/**
 * @swagger
 * /admin/self-monitoring/{id}:
 *   get:
 *     summary: "[Admin] Detalhar bloco de automonitoramento"
 *     description: Retorna os dados de um bloco de automonitoramento específico.
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminSelfMonitoringRouter.get("/:id", isAuthenticated_1.isAuthenticated, new FindSelfMonitoringBlockController_1.FindSelfMonitoringBlocksController().handle);
