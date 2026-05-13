"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const CreateUserController_1 = require("../controllers/user/CreateUserController");
const DeleteUserController_1 = require("../controllers/user/DeleteUserController");
const FindUserByController_1 = require("../controllers/user/FindUserByController");
const FindUserController_1 = require("../controllers/user/FindUserController");
const GetUserFiltersController_1 = require("../controllers/user/GetUserFiltersController");
const ListAllUsersController_1 = require("../controllers/user/ListAllUsersController");
const ListUsersByCompanyController_1 = require("../controllers/user/ListUsersByCompanyController");
const SearchUsersController_1 = require("../controllers/user/SearchUsersController");
const UpdateUserController_1 = require("../controllers/user/UpdateUserController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca paginada e filtrada de usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados paginados
 */
userRouter.get("/search", isAuthenticated_1.isAuthenticated, new SearchUsersController_1.SearchUsersController().handle);
/**
 * @swagger
 * /users/filters:
 *   get:
 *     summary: Obter valores disponíveis para filtros de usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valores únicos por campo
 */
userRouter.get("/filters", isAuthenticated_1.isAuthenticated, new GetUserFiltersController_1.GetUserFiltersController().handle);
/**
 * @swagger
 * /users/find-by:
 *   get:
 *     summary: Buscar usuário por identificador único
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
userRouter.get("/find-by", isAuthenticated_1.isAuthenticated, new FindUserByController_1.FindUserByController().handle);
/**
 * @swagger
 * /users/company/{companyId}:
 *   get:
 *     summary: Listar usuários de uma empresa
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuários da empresa
 */
userRouter.get("/company/:companyId", isAuthenticated_1.isAuthenticated, new ListUsersByCompanyController_1.ListUsersByCompanyController().handle);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuários
 */
userRouter.get("/", isAuthenticated_1.isAuthenticated, new ListAllUsersController_1.ListAllUsersController().handle);
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Detalhar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
userRouter.get("/:userId", isAuthenticated_1.isAuthenticated, new FindUserController_1.FindUserController().handle);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
userRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário excluído
 */
userRouter.delete("/:id", isAuthenticated_1.isAuthenticated, new DeleteUserController_1.DeleteUserController().handle);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário (auto-cadastro)
 *     description: >
 *       Cria um novo usuário no sistema. Endpoint público — não requer autenticação.
 *       Utilizado para auto-cadastro de colaboradores.
 *       Campos demográficos (gênero, cor, deficiência, etc.) são opcionais e usados apenas para fins de relatório e segmentação.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Senha para autenticação tradicional (opcional — sistema aceita magic code sem senha)
 *               phoneNumber:
 *                 type: string
 *                 description: "Telefone celular em formato brasileiro (ex: 11999999999 — armazenado somente com dígitos)"
 *               customId:
 *                 type: string
 *                 description: "Identificador externo do usuário no sistema do cliente (ex: matrícula de RH)"
 *               birthdate:
 *                 type: string
 *                 description: Data de nascimento no formato DD/MM/YYYY ou ISO 8601
 *                 example: "15/06/1990"
 *               admissionDate:
 *                 type: string
 *                 description: Data de admissão na empresa (DD/MM/YYYY ou ISO 8601)
 *               nationalityId:
 *                 type: string
 *                 format: cuid
 *                 description: ID da nacionalidade do usuário (determina qual avaliação localizada será exibida)
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               occupation:
 *                 type: string
 *                 description: Cargo ou função
 *               occupationLevel:
 *                 type: string
 *                 description: "Nível hierárquico (ex: Júnior, Pleno, Sênior, Gerência)"
 *               area:
 *                 type: string
 *                 description: Área ou departamento
 *               location:
 *                 type: string
 *                 description: Localidade/unidade de trabalho
 *               skinColor:
 *                 type: string
 *                 description: Autodeclaração de cor/raça
 *               hasDisability:
 *                 type: boolean
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
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
userRouter.post("/", new CreateUserController_1.CreateUserController().handle);
