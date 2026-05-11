"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const CreateUserController_1 = require("../controllers/user/CreateUserController");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
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
