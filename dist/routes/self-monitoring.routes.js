"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfMonitoringRouter = void 0;
const express_1 = require("express");
const ListSelfMonitoringBlockResultsController_1 = require("../controllers/self-monitoring-block/ListSelfMonitoringBlockResultsController");
const ListSelfMonitoringBlocksController_1 = require("../controllers/self-monitoring-block/ListSelfMonitoringBlocksController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const selfMonitoringRouter = (0, express_1.Router)();
exports.selfMonitoringRouter = selfMonitoringRouter;
/**
 * @swagger
 * /self-monitoring:
 *   get:
 *     summary: Listar blocos de automonitoramento
 *     description: >
 *       Retorna os blocos temáticos de automonitoramento disponíveis para o usuário autenticado.
 *       Um bloco agrupa avaliações e dimensões psicológicas de uma mesma área temática (ex: 'Saúde Mental', 'Clima Organizacional').
 *     tags: [Self-Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de blocos de automonitoramento
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
selfMonitoringRouter.get("/", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlocksController_1.ListSelfMonitoringBlocksController().handle);
/**
 * @swagger
 * /self-monitoring/results/{selfMonitoringBlockId}:
 *   get:
 *     summary: Listar resultados de avaliações de um bloco
 *     description: >
 *       Retorna os resultados de todas as avaliações do usuário autenticado que pertencem ao bloco de automonitoramento indicado.
 *       Permite visualizar a evolução do usuário em uma área temática específica ao longo do tempo.
 *     tags: [Self-Monitoring]
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
 *         description: Resultados do usuário no bloco
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
 *                     $ref: '#/components/schemas/AssessmentResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
selfMonitoringRouter.get("/results/:selfMonitoringBlockId", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlockResultsController_1.ListSelfMonitoringBlockResultsController().handle);
