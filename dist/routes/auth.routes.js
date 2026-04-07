"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthUserController_1 = require("../controllers/user/auth/AuthUserController");
const SendCodeController_1 = require("../controllers/user/auth/SendCodeController");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
authRoutes.post("/email", new SendCodeController_1.SendCodeController().handle);
/**
 * @swagger
 * /auth/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar usuario por email com codigo ou senha
 *     description: Valida as credenciais de acesso de um usuario pelo email e libera sessao quando a verificacao for bem-sucedida. Internamente, o sistema localiza o usuario pelo email e aceita autenticacao por codigo temporario (enviado anteriormente) ou por senha cadastrada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuario que esta tentando autenticar.
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: Codigo temporario de 6 digitos enviado para o email do usuario.
 *               password:
 *                 type: string
 *                 description: Senha cadastrada do usuario. Pode ser usada no lugar do codigo.
 *             anyOf:
 *               - required: [code]
 *               - required: [password]
 *     responses:
 *       200:
 *         description: Usuario autenticado com sucesso
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
 *                   required: [name, role, token, expiresAt]
 *                   properties:
 *                     name:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       nullable: true
 *                     act:
 *                       type: string
 *                       nullable: true
 *                       description: ID do chatbot ACT atual do usuario na jornada.
 *                     role:
 *                       type: string
 *                       description: Perfil de acesso do usuario no sistema.
 *                     token:
 *                       type: string
 *                       description: Token JWT para autenticacao nas rotas protegidas.
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: Data e hora de expiracao do token retornado.
 *       400:
 *         description: PublicError
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/verify", new AuthUserController_1.AuthUserController().handle);
