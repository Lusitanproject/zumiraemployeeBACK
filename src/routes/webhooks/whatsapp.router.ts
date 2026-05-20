import { Router } from "express";

import { ReceiveWhatsappActMessageController } from "../../controllers/whatsapp/ReceiveWhatsappActMessageController";

const whatsappWebhookRouter = Router();

/**
 * @swagger
 * /webhooks/whatsapp/act/receive:
 *   post:
 *     summary: Webhook de recebimento de mensagem WhatsApp para ACT
 *     description: >
 *       Endpoint público chamado pela plataforma Meta ao receber uma mensagem.
 *       Identifica o usuário pelo número de telefone, encontra ou cria o capítulo de ACT ativo
 *       e envia a resposta da IA de volta pelo WhatsApp.
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
