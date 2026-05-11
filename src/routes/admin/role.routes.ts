import { Router } from "express";

import { CreateRoleController } from "../../controllers/admin/roles/CreateRoleController";
import { DeleteRoleController } from "../../controllers/admin/roles/DeleteRoleController";
import { FindAllRolesController } from "../../controllers/admin/roles/FindAllRolesController";
import { FindRoleController } from "../../controllers/admin/roles/FindRoleController";
import { SetRolePermissionsController } from "../../controllers/admin/roles/SetRolePermissionsController";
import { UpdateRoleController } from "../../controllers/admin/roles/UpdateRoleController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminRoleRouter = Router();

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     summary: "[Admin] Listar papéis de acesso"
 *     description: Retorna todos os papéis (roles) cadastrados no sistema. Papéis definem o conjunto de permissões de um usuário.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de papéis
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
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminRoleRouter.get("/", isAuthenticated, new FindAllRolesController().handle);

/**
 * @swagger
 * /admin/roles/{id}:
 *   get:
 *     summary: "[Admin] Detalhar papel de acesso"
 *     description: Retorna os dados de um papel específico, incluindo as permissões atribuídas.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do papel
 *     responses:
 *       200:
 *         description: Dados do papel com permissões
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
 *                     - $ref: '#/components/schemas/Role'
 *                     - type: object
 *                       properties:
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Lista de strings de permissão atribuídas ao papel
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminRoleRouter.get("/:id", isAuthenticated, new FindRoleController().handle);

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     summary: "[Admin] Criar papel de acesso"
 *     description: >
 *       Cria um novo papel de acesso. Requer permissão `manage-roles`.
 *       O `slug` é o identificador legível único do papel (ex: "admin", "collaborator", "manager").
 *       Após criar, use `PUT /admin/roles/:id/permissions` para atribuir permissões.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *             properties:
 *               slug:
 *                 type: string
 *                 description: "Identificador único legível do papel (ex:'admin', 'collaborator')"
 *                 example: collaborator
 *     responses:
 *       200:
 *         description: Papel criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminRoleRouter.post("/", isAuthenticated, new CreateRoleController().handle);

/**
 * @swagger
 * /admin/roles/{id}:
 *   put:
 *     summary: "[Admin] Atualizar papel de acesso"
 *     description: Atualiza o slug de um papel existente.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do papel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Papel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminRoleRouter.put("/:id", isAuthenticated, new UpdateRoleController().handle);

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     summary: "[Admin] Excluir papel de acesso"
 *     description: Remove permanentemente um papel. Não é possível excluir papéis que estejam atribuídos a usuários ativos.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Papel excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminRoleRouter.delete("/:id", isAuthenticated, new DeleteRoleController().handle);

/**
 * @swagger
 * /admin/roles/{id}/permissions:
 *   put:
 *     summary: "[Admin] Definir permissões de um papel"
 *     description: >
 *       Substitui integralmente as permissões de um papel (operação idempotente: sempre sobrescreve tudo).
 *       Use `GET /admin/permissions` para obter a lista de permissões disponíveis no sistema.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do papel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 description: Lista completa de strings de permissão a atribuir ao papel (substitui as existentes)
 *                 items:
 *                   type: string
 *                 example: ["manage-users", "read-assessment", "answer-assessment"]
 *     responses:
 *       200:
 *         description: Permissões atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminRoleRouter.put("/:id/permissions", isAuthenticated, new SetRolePermissionsController().handle);

export { adminRoleRouter };
