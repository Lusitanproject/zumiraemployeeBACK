import { Router } from "express";

import { AuthUserController } from "../controllers/user/auth/AuthUserController";
import { SendCodeController } from "../controllers/user/auth/SendCodeController";

const authRouter = Router();

/**
 * @swagger
 * /auth/email:
 *   post:
 *     summary: Enviar código de verificação por e-mail
 *     description: Envia um código numérico de 6 dígitos para o e-mail informado. Usado no fluxo de autenticação sem senha (magic code). O código expira após alguns minutos.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: colaborador@empresa.com
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post("/email", new SendCodeController().handle);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Autenticar usuário (código ou senha)
 *     description: >
 *       Autentica o usuário e retorna um JWT Bearer token.
 *       Suporta dois fluxos:
 *       1. **Magic code**: informar `email` + `code` (código de 6 dígitos enviado por e-mail)
 *       2. **Senha**: informar `email` + `password`
 *       Ao menos um dos campos `code` ou `password` deve ser fornecido.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: Código de verificação de 6 dígitos enviado por e-mail (fluxo magic code)
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 description: Senha do usuário (fluxo tradicional)
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida — retorna JWT token
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
 *                     token:
 *                       type: string
 *                       description: JWT Bearer token para uso nas próximas requisições
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post("/verify", new AuthUserController().handle);

export { authRouter };
