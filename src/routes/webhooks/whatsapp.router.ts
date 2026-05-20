import { Router } from "express";

import { ReceiveWhatsappActMessageController } from "../../controllers/whatsapp/ReceiveWhatsappActMessageController";
import { VerifyWhatsappWebhookController } from "../../controllers/whatsapp/VerifyWhatsappWebhookController";

const whatsappWebhookRouter = Router();

/**
 * @swagger
 * /webhooks/whatsapp/act/receive:
 *   get:
 *     summary: Verificação do webhook WhatsApp (Meta)
 *     description: Chamado pelo Meta ao registrar o webhook. Responde com hub.challenge se o token for válido.
 *     tags: [Webhooks]
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token válido — retorna hub.challenge
 *       403:
 *         description: Token inválido
 */
whatsappWebhookRouter.get("/act/receive", new VerifyWhatsappWebhookController().handle);

/**
 * @swagger
 * /webhooks/whatsapp/act/receive:
 *   post:
 *     summary: Receber mensagem WhatsApp para ACT
 *     description: >
 *       Chamado pelo Meta ao receber uma mensagem. Identifica o usuário pelo número de telefone,
 *       encontra ou cria o capítulo de ACT ativo e envia a resposta da IA de volta pelo WhatsApp.
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload do webhook WhatsApp (formato Meta Cloud API)
 *     responses:
 *       200:
 *         description: Mensagem processada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
whatsappWebhookRouter.post("/act/receive", new ReceiveWhatsappActMessageController().handle);

export { whatsappWebhookRouter };
