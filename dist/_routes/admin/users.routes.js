"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUsersRoutes = void 0;
const express_1 = require("express");
const CreateManyUsersController_1 = require("../../controllers/admin/users/CreateManyUsersController");
const CreateUserController_1 = require("../../controllers/admin/users/CreateUserController");
const DeleteUserController_1 = require("../../controllers/admin/users/DeleteUserController");
const FindUserByController_1 = require("../../controllers/admin/users/FindUserByController");
const FindUserController_1 = require("../../controllers/admin/users/FindUserController");
const ListAllUsersController_1 = require("../../controllers/admin/users/ListAllUsersController");
const ListUsersByCompanyController_1 = require("../../controllers/admin/users/ListUsersByCompanyController");
const UpdateUserController_1 = require("../../controllers/admin/users/UpdateUserController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminUsersRoutes = (0, express_1.Router)();
exports.adminUsersRoutes = adminUsersRoutes;
adminUsersRoutes.post("/admin", isAuthenticated_1.isAuthenticated, new CreateUserController_1.CreateUserController().handle);
/**
 * @swagger
 * /users/admin/find-by:
 *   get:
 *     tags: [AdminUsers]
 *     summary: Buscar usuario por identificadores
 *     description: Permite localizar um usuario usando identificadores alternativos (id, email e/ou telefone). Internamente, aplica o filtro informado para encontrar o cadastro correspondente e retorna o usuario encontrado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID do usuario que se deseja localizar.
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: email
 *         description: Email do usuario a ser buscado.
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: phoneNumber
 *         description: Telefone do usuario a ser buscado.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
adminUsersRoutes.get("/admin/find-by", isAuthenticated_1.isAuthenticated, new FindUserByController_1.FindUserByController().handle);
adminUsersRoutes.put("/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
adminUsersRoutes.delete("/:id", isAuthenticated_1.isAuthenticated, new DeleteUserController_1.DeleteUserController().handle);
adminUsersRoutes.get("/", isAuthenticated_1.isAuthenticated, new ListAllUsersController_1.ListAllUsersController().handle);
adminUsersRoutes.get("/company/:companyId", isAuthenticated_1.isAuthenticated, new ListUsersByCompanyController_1.ListUsersByCompanyController().handle);
adminUsersRoutes.get("/:userId", isAuthenticated_1.isAuthenticated, new FindUserController_1.FindUserController().handle);
/**
 * @swagger
 * /users/admin/create-many:
 *   post:
 *     tags: [AdminUsers]
 *     summary: Criar usuarios em lote
 *     description: Cria varios usuarios de uma so vez. Todos os usuarios do lote devem pertencer a mesma empresa quando `companyId` for informado. O ACT inicial e definido pelo primeiro ato da trilha da empresa; quando `companyId` nao e informado, usa o ACT padrao global (menor indice).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             minItems: 1
 *             items:
 *               type: object
 *               required: [email, name, roleId]
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email do usuario.
 *                 name:
 *                   type: string
 *                   minLength: 1
 *                   description: Nome do usuario.
 *                 roleId:
 *                   type: string
 *                   format: uuid
 *                   description: ID da role/permissao do usuario.
 *                 companyId:
 *                   type: string
 *                   description: ID da empresa do usuario (opcional, deve ser o mesmo para todos os itens quando informado).
 *                 phoneNumber:
 *                   type: string
 *                   description: Telefone do usuario (opcional).
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, data]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   required: [items]
 *                   properties:
 *                     items:
 *                       type: object
 *                       required: [count]
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: Quantidade de usuarios criados no lote.
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
adminUsersRoutes.post("/admin/create-many", isAuthenticated_1.isAuthenticated, new CreateManyUsersController_1.CreateManyUsersController().handle);
