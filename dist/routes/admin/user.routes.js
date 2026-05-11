"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserRouter = void 0;
const express_1 = require("express");
const CreateManyUsersController_1 = require("../../controllers/admin/users/CreateManyUsersController");
const CreateUserController_1 = require("../../controllers/admin/users/CreateUserController");
const DeleteUserController_1 = require("../../controllers/admin/users/DeleteUserController");
const FindUserByController_1 = require("../../controllers/admin/users/FindUserByController");
const FindUserController_1 = require("../../controllers/admin/users/FindUserController");
const ListAllUsersController_1 = require("../../controllers/admin/users/ListAllUsersController");
const ListUsersByCompanyController_1 = require("../../controllers/admin/users/ListUsersByCompanyController");
const GetUserFiltersController_1 = require("../../controllers/admin/users/GetUserFiltersController");
const SearchUsersController_1 = require("../../controllers/admin/users/SearchUsersController");
const UpdateUserController_1 = require("../../controllers/admin/users/UpdateUserController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminUserRouter = (0, express_1.Router)();
exports.adminUserRouter = adminUserRouter;
/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: "[Admin] Criar usuário"
 *     description: >
 *       Cria um novo usuário administrativamente. Requer permissão `manage-users`.
 *       Diferente do cadastro público (`POST /users`), este endpoint exige `roleId` e permite vincular o usuário diretamente a uma empresa.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - roleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: Papel de acesso atribuído ao usuário
 *               companyId:
 *                 type: string
 *                 format: cuid
 *                 description: Empresa à qual o usuário pertence
 *               customId:
 *                 type: string
 *                 description: "Identificador externo no sistema do cliente (ex: matrícula de RH)"
 *               occupation:
 *                 type: string
 *               occupationLevel:
 *                 type: string
 *               area:
 *                 type: string
 *               location:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               hasDisability:
 *                 type: boolean
 *               admissionDate:
 *                 type: string
 *                 description: Data de admissão (DD/MM/YYYY ou ISO 8601)
 *               phoneNumber:
 *                 type: string
 *                 description: Telefone celular brasileiro (somente dígitos após normalização)
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminUserRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateUserController_1.CreateUserController().handle);
/**
 * @swagger
 * /admin/users/create-many:
 *   post:
 *     summary: "[Admin] Criar múltiplos usuários em lote"
 *     description: >
 *       Cria vários usuários de uma vez a partir de um array. Útil para importação em massa (ex: carga inicial de colaboradores).
 *       Cada usuário segue o mesmo esquema do `POST /admin/users`.
 *     tags: [Admin - Users]
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
 *               required:
 *                 - email
 *                 - name
 *                 - roleId
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *                 roleId:
 *                   type: string
 *                   format: uuid
 *                 companyId:
 *                   type: string
 *                   format: cuid
 *                 customId:
 *                   type: string
 *                 occupation:
 *                   type: string
 *                 occupationLevel:
 *                   type: string
 *                 area:
 *                   type: string
 *                 location:
 *                   type: string
 *                 skinColor:
 *                   type: string
 *                 hasDisability:
 *                   type: boolean
 *                 admissionDate:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuários criados com sucesso
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
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminUserRouter.post("/create-many", isAuthenticated_1.isAuthenticated, new CreateManyUsersController_1.CreateManyUsersController().handle);
/**
 * @swagger
 * /admin/users/find-by:
 *   get:
 *     summary: "[Admin] Buscar usuário por identificador único"
 *     description: >
 *       Busca um usuário específico por um de seus identificadores únicos.
 *       Ao menos um dos parâmetros deve ser fornecido: `id`, `email`, `customId` ou `phoneNumber`.
 *       `customId` é o identificador externo do sistema do cliente (ex: matrícula de RH).
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID interno do usuário
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: customId
 *         schema:
 *           type: string
 *         description: "Identificador externo no sistema do cliente (ex: matrícula de RH)"
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Telefone celular (somente dígitos)
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminUserRouter.get("/find-by", isAuthenticated_1.isAuthenticated, new FindUserByController_1.FindUserByController().handle);
/**
 * @swagger
 * /admin/users/search:
 *   get:
 *     summary: "[Admin] Busca paginada e filtrada de usuários"
 *     description: >
 *       Busca usuários com filtros demográficos e paginação.
 *       `search` realiza busca por nome, e-mail ou `customId`.
 *       `columns` no endpoint `/admin/users/filters` retorna os valores disponíveis para cada filtro.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto livre para busca por nome, e-mail ou customId
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *       - in: query
 *         name: occupation
 *         schema:
 *           type: string
 *       - in: query
 *         name: occupationLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: skinColor
 *         schema:
 *           type: string
 *       - in: query
 *         name: hasDisability
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filtrar por PcD (string "true" ou "false" — convertido para boolean internamente)
 *       - in: query
 *         name: nationalityId
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Resultados paginados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedUsers'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminUserRouter.get("/search", isAuthenticated_1.isAuthenticated, new SearchUsersController_1.SearchUsersController().handle);
/**
 * @swagger
 * /admin/users/filters:
 *   get:
 *     summary: "[Admin] Obter valores disponíveis para filtros de usuário"
 *     description: >
 *       Retorna os valores únicos disponíveis nos campos de usuário indicados em `columns`.
 *       Usado para popular dropdowns de filtro na interface administrativa.
 *       `columns` deve conter um ou mais nomes de campo válidos.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: columns
 *         required: true
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [gender, occupation, occupationLevel, area, location, skinColor, hasDisability, roleId, companyId, nationalityId]
 *         description: Campos para retornar valores únicos disponíveis (usados como opções de filtro)
 *     responses:
 *       200:
 *         description: Valores únicos por campo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items: {}
 *                   example:
 *                     gender: ["MALE", "FEMALE"]
 *                     occupation: ["Analista", "Gerente"]
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminUserRouter.get("/filters", isAuthenticated_1.isAuthenticated, new GetUserFiltersController_1.GetUserFiltersController().handle);
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: "[Admin] Listar todos os usuários"
 *     description: Retorna todos os usuários sem paginação. Para buscas filtradas use `GET /admin/users/search`.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuários
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
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminUserRouter.get("/", isAuthenticated_1.isAuthenticated, new ListAllUsersController_1.ListAllUsersController().handle);
/**
 * @swagger
 * /admin/users/company/{companyId}:
 *   get:
 *     summary: "[Admin] Listar usuários de uma empresa"
 *     description: Retorna todos os usuários vinculados à empresa indicada. Requer permissão `manage-users`.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Usuários da empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminUserRouter.get("/company/:companyId", isAuthenticated_1.isAuthenticated, new ListUsersByCompanyController_1.ListUsersByCompanyController().handle);
/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: "[Admin] Detalhar usuário"
 *     description: Retorna os dados completos de um usuário, incluindo papel, empresa e dados demográficos.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminUserRouter.get("/:userId", isAuthenticated_1.isAuthenticated, new FindUserController_1.FindUserController().handle);
/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: "[Admin] Atualizar usuário"
 *     description: Atualiza os dados de um usuário. Todos os campos são opcionais — apenas os campos enviados serão atualizados.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               roleId:
 *                 type: string
 *                 format: uuid
 *               companyId:
 *                 type: string
 *                 format: cuid
 *               customId:
 *                 type: string
 *               occupation:
 *                 type: string
 *               occupationLevel:
 *                 type: string
 *               area:
 *                 type: string
 *               location:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               hasDisability:
 *                 type: boolean
 *               admissionDate:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminUserRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: "[Admin] Excluir usuário"
 *     description: Remove permanentemente um usuário do sistema. Ação irreversível.
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a excluir
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminUserRouter.delete("/:id", isAuthenticated_1.isAuthenticated, new DeleteUserController_1.DeleteUserController().handle);
