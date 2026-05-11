"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminNationalityRouter = void 0;
const express_1 = require("express");
const CreateNationalityController_1 = require("../../controllers/admin/nationalities/CreateNationalityController");
const FindAllNationalitiesController_1 = require("../../controllers/admin/nationalities/FindAllNationalitiesController");
const FindNationalityController_1 = require("../../controllers/admin/nationalities/FindNationalityController");
const UpdateNationalityController_1 = require("../../controllers/admin/nationalities/UpdateNationalityController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminNationalityRouter = (0, express_1.Router)();
exports.adminNationalityRouter = adminNationalityRouter;
/**
 * @swagger
 * /admin/nationalities:
 *   post:
 *     summary: "[Admin] Criar nacionalidade"
 *     description: >
 *       Cria uma nova nacionalidade no sistema.
 *       O `acronym` é o código curto (2-5 caracteres) exibido em seletores e filtros (ex: 'BR', 'PT', 'USA').
 *       Ao criar uma nacionalidade, avaliações específicas podem ser criadas para ela via `POST /assessments`.
 *     tags: [Admin - Nationalities]
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
 *             properties:
 *               acronym:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 5
 *                 description: "Código curto da nacionalidade (ex:'BR','PT','USA')"
 *                 example: BR
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Brasileiro
 *     responses:
 *       200:
 *         description: Nacionalidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Nationality'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNationalityRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateNationalityController_1.CreateNationalityController().handle);
/**
 * @swagger
 * /admin/nationalities:
 *   get:
 *     summary: "[Admin] Listar nacionalidades"
 *     description: Retorna todas as nacionalidades cadastradas. Versão autenticada de `GET /nationalities`.
 *     tags: [Admin - Nationalities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de nacionalidades
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
 *                     $ref: '#/components/schemas/Nationality'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNationalityRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllNationalitiesController_1.FindAllNationalitiesController().handle);
/**
 * @swagger
 * /admin/nationalities/{id}:
 *   get:
 *     summary: "[Admin] Detalhar nacionalidade"
 *     description: Retorna os dados de uma nacionalidade específica.
 *     tags: [Admin - Nationalities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da nacionalidade
 *     responses:
 *       200:
 *         description: Dados da nacionalidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Nationality'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNationalityRouter.get("/:id", isAuthenticated_1.isAuthenticated, new FindNationalityController_1.FindNationalityController().handle);
/**
 * @swagger
 * /admin/nationalities/{id}:
 *   put:
 *     summary: "[Admin] Atualizar nacionalidade"
 *     description: Atualiza o acrônimo ou nome de uma nacionalidade.
 *     tags: [Admin - Nationalities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da nacionalidade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acronym
 *               - name
 *             properties:
 *               acronym:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 5
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Nacionalidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Nationality'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNationalityRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateNationalityController_1.UpdateNationalityController().handle);
