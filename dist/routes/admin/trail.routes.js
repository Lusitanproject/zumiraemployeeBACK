"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTrailRouter = void 0;
const express_1 = require("express");
const CreateTrailController_copy_1 = require("../../controllers/admin/trails/CreateTrailController copy");
const FindAllTrailsController_1 = require("../../controllers/admin/trails/FindAllTrailsController");
const FindTrailController_1 = require("../../controllers/admin/trails/FindTrailController");
const UpdateTrailController_1 = require("../../controllers/admin/trails/UpdateTrailController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminTrailRouter = (0, express_1.Router)();
exports.adminTrailRouter = adminTrailRouter;
/**
 * @swagger
 * /admin/trails:
 *   post:
 *     summary: "[Admin] Criar trilha"
 *     description: >
 *       Cria uma nova trilha/programa de intervenção.
 *       Trilhas agrupam ACTs em sequência e são vinculadas a empresas.
 *       Ao criar uma empresa (`POST /admin/companies`), ela é vinculada a uma trilha, determinando quais ACTs seus colaboradores terão acesso.
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
 */
adminTrailRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateTrailController_copy_1.CreateTrailController().handle);
/**
 * @swagger
 * /admin/trails:
 *   get:
 *     summary: "[Admin] Listar trilhas"
 *     description: Retorna todas as trilhas/programas de intervenção cadastrados no sistema.
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
 */
adminTrailRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllTrailsController_1.FindAllTrailsController().handle);
/**
 * @swagger
 * /admin/trails/{id}:
 *   get:
 *     summary: "[Admin] Detalhar trilha"
 *     description: Retorna os dados de uma trilha específica, incluindo os ACTs vinculados.
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminTrailRouter.get("/:id", isAuthenticated_1.isAuthenticated, new FindTrailController_1.FindTrailController().handle);
/**
 * @swagger
 * /admin/trails/{id}:
 *   put:
 *     summary: "[Admin] Atualizar trilha"
 *     description: Atualiza os dados de uma trilha. Todos os campos são opcionais.
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminTrailRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateTrailController_1.UpdateTrailController().handle);
