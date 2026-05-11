"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDimensionRouter = void 0;
const express_1 = require("express");
const CreateDimensionController_1 = require("../../controllers/admin/dimensions/CreateDimensionController");
const EditDimensionController_1 = require("../../controllers/admin/dimensions/EditDimensionController");
const FindAllDimensionController_1 = require("../../controllers/admin/dimensions/FindAllDimensionController");
const FindDimensionController_1 = require("../../controllers/admin/dimensions/FindDimensionController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminDimensionRouter = (0, express_1.Router)();
exports.adminDimensionRouter = adminDimensionRouter;
/**
 * @swagger
 * /admin/dimensions:
 *   post:
 *     summary: "[Admin] Criar dimensão psicológica"
 *     description: >
 *       Cria uma nova dimensão psicológica vinculada a um bloco de automonitoramento.
 *       Dimensões são os traços ou competências medidos pelas perguntas de avaliação (ex: 'Estresse', 'Resiliência', 'Engajamento').
 *       O `acronym` é o código curto exibido em gráficos e relatórios.
 *     tags: [Admin - Dimensions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acronym
 *               - name
 *               - selfMonitoringBlockId
 *             properties:
 *               acronym:
 *                 type: string
 *                 minLength: 1
 *                 description: "Código curto da dimensão para exibição em gráficos (ex:'EST', 'RES')"
 *                 example: EST
 *               name:
 *                 type: string
 *                 description: Nome completo da dimensão
 *                 example: Estresse
 *               selfMonitoringBlockId:
 *                 type: string
 *                 format: cuid
 *                 description: Bloco temático ao qual esta dimensão pertence
 *     responses:
 *       200:
 *         description: Dimensão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychologicalDimension'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminDimensionRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateDimensionController_1.CreateDimensionController().handle);
/**
 * @swagger
 * /admin/dimensions:
 *   get:
 *     summary: "[Admin] Listar dimensões psicológicas"
 *     description: Retorna todas as dimensões psicológicas cadastradas no sistema.
 *     tags: [Admin - Dimensions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dimensões
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
 */
adminDimensionRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllDimensionController_1.FindAllDimensionsController().handle);
/**
 * @swagger
 * /admin/dimensions/{psychologicalDimensionId}:
 *   get:
 *     summary: "[Admin] Detalhar dimensão psicológica"
 *     description: Retorna os dados de uma dimensão psicológica específica.
 *     tags: [Admin - Dimensions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: psychologicalDimensionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da dimensão psicológica
 *     responses:
 *       200:
 *         description: Dados da dimensão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychologicalDimension'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminDimensionRouter.get("/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new FindDimensionController_1.FindDimensionController().handle);
/**
 * @swagger
 * /admin/dimensions/{psychologicalDimensionId}:
 *   put:
 *     summary: "[Admin] Atualizar dimensão psicológica"
 *     description: Atualiza os dados de uma dimensão psicológica existente.
 *     tags: [Admin - Dimensions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: psychologicalDimensionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da dimensão psicológica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acronym
 *               - name
 *               - selfMonitoringBlockId
 *             properties:
 *               acronym:
 *                 type: string
 *               name:
 *                 type: string
 *               selfMonitoringBlockId:
 *                 type: string
 *                 format: cuid
 *     responses:
 *       200:
 *         description: Dimensão atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychologicalDimension'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminDimensionRouter.put("/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new EditDimensionController_1.EditDimensionController().handle);
