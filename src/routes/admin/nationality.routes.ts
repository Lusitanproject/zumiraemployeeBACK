import { Router } from "express";

import { CreateNationalityController } from "../../controllers/admin/nationalities/CreateNationalityController";
import { FindAllNationalitiesController } from "../../controllers/admin/nationalities/FindAllNationalitiesController";
import { FindNationalityController } from "../../controllers/admin/nationalities/FindNationalityController";
import { UpdateNationalityController } from "../../controllers/admin/nationalities/UpdateNationalityController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminNationalityRouter = Router();

/**
 * @swagger
 * /admin/nationalities:
 *   post:
 *     summary: "[Admin] Criar nacionalidade"
 *     description: >
 *       Cria uma nova nacionalidade no sistema.
 *       O `acronym` é o código curto (2-5 caracteres) exibido em seletores e filtros (ex: 'BR', 'PT', 'USA').
 *       Ao criar uma nacionalidade, avaliações específicas podem ser criadas para ela via `POST /assessments`.
 *       Requer permissão `manage-nationalities`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminNationalityRouter.post("/", isAuthenticated, requirePermissions(["manage-nationalities"]), new CreateNationalityController().handle);

/**
 * @swagger
 * /admin/nationalities:
 *   get:
 *     summary: "[Admin] Listar nacionalidades"
 *     description: "Retorna todas as nacionalidades cadastradas. Versão autenticada de `GET /nationalities`. Requer permissão `manage-nationalities`."
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminNationalityRouter.get("/", isAuthenticated, requirePermissions(["manage-nationalities"]), new FindAllNationalitiesController().handle);

/**
 * @swagger
 * /admin/nationalities/{id}:
 *   get:
 *     summary: "[Admin] Detalhar nacionalidade"
 *     description: "Retorna os dados de uma nacionalidade específica. Requer permissão `manage-nationalities`."
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNationalityRouter.get("/:id", isAuthenticated, requirePermissions(["manage-nationalities"]), new FindNationalityController().handle);

/**
 * @swagger
 * /admin/nationalities/{id}:
 *   put:
 *     summary: "[Admin] Atualizar nacionalidade"
 *     description: "Atualiza o acrônimo ou nome de uma nacionalidade. Requer permissão `manage-nationalities`."
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNationalityRouter.put("/:id", isAuthenticated, requirePermissions(["manage-nationalities"]), new UpdateNationalityController().handle);

export { adminNationalityRouter };
