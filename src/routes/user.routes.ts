import { Router } from "express";

import { CreateUserController } from "../controllers/user/CreateUserController";
import { DeleteUserController } from "../controllers/user/DeleteUserController";
import { FindUserByController } from "../controllers/user/FindUserByController";
import { FindUserController } from "../controllers/user/FindUserController";
import { GetUserFiltersController } from "../controllers/user/GetUserFiltersController";
import { ListAllUsersController } from "../controllers/user/ListAllUsersController";
import { ListUsersByCompanyController } from "../controllers/user/ListUsersByCompanyController";
import { SearchUsersController } from "../controllers/user/SearchUsersController";
import { UpdateUserController } from "../controllers/user/UpdateUserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { requirePermissions } from "../middlewares/requirePermissions";
import { requireSameCompany } from "../middlewares/requireSameCompany";

const userRouter = Router();

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca paginada e filtrada de usuários
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados paginados
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.get("/search", isAuthenticated, requirePermissions("manage-users"), new SearchUsersController().handle);

/**
 * @swagger
 * /users/filters:
 *   get:
 *     summary: Obter valores disponíveis para filtros de usuário
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valores únicos por campo
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.get("/filters", isAuthenticated, requirePermissions("manage-users"), new GetUserFiltersController().handle);

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
userRouter.get("/find-by", isAuthenticated, new FindUserByController().handle);

/**
 * @swagger
 * /users/company/{companyId}:
 *   get:
 *     summary: Listar usuários de uma empresa
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuários da empresa
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.get(
  "/company/:companyId",
  isAuthenticated,
  requirePermissions("view-company-users"),
  requireSameCompany("params"),
  new ListUsersByCompanyController().handle,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuários
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.get("/", isAuthenticated, requirePermissions("manage-users"), new ListAllUsersController().handle);

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
userRouter.get("/:userId", isAuthenticated, new FindUserController().handle);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.put("/:id", isAuthenticated, requirePermissions("manage-users"), new UpdateUserController().handle);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     description: "Requer permissão `manage-users`."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário excluído
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.delete("/:id", isAuthenticated, requirePermissions("manage-users"), new DeleteUserController().handle);

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
 *               similarExposureGroup:
 *                 type: string
 *                 description: Grupo de exposição similar (GES) do colaborador
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
userRouter.post("/", new CreateUserController().handle);

export { userRouter };
