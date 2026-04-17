import { Router } from "express";

import { CreateManyUsersController } from "../../controllers/admin/users/CreateManyUsersController";
import { CreateUserController } from "../../controllers/admin/users/CreateUserController";
import { DeleteUserController } from "../../controllers/admin/users/DeleteUserController";
import { FindUserByController } from "../../controllers/admin/users/FindUserByController";
import { FindUserController } from "../../controllers/admin/users/FindUserController";
import { ListAllUsersController } from "../../controllers/admin/users/ListAllUsersController";
import { ListUsersByCompanyController } from "../../controllers/admin/users/ListUsersByCompanyController";
import { UpdateUserController } from "../../controllers/admin/users/UpdateUserController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminUsersRoutes = Router();

adminUsersRoutes.post("/admin", isAuthenticated, new CreateUserController().handle);

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
adminUsersRoutes.get("/admin/find-by", isAuthenticated, new FindUserByController().handle);
adminUsersRoutes.put("/admin/:id", isAuthenticated, new UpdateUserController().handle);
adminUsersRoutes.delete("/:id", isAuthenticated, new DeleteUserController().handle);
adminUsersRoutes.get("/", isAuthenticated, new ListAllUsersController().handle);
adminUsersRoutes.get("/company/:companyId", isAuthenticated, new ListUsersByCompanyController().handle);
adminUsersRoutes.get("/:userId", isAuthenticated, new FindUserController().handle);
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
adminUsersRoutes.post("/admin/create-many", isAuthenticated, new CreateManyUsersController().handle);

export { adminUsersRoutes };
