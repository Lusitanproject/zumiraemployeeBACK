import { Router } from "express";

import { WhatsappWebhookController } from "../../controllers/webhooks/whatsapp/WhatsappWebhookController";
import { VerifyWhatsappWebhookController } from "../../controllers/webhooks/whatsapp/VerifyWhatsappWebhookController";

const whatsappWebhookRouter = Router();

/**
 * @swagger
 * /webhooks/whatsapp:
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
whatsappWebhookRouter.get("/", new VerifyWhatsappWebhookController().handle);

/**
 * @swagger
 * /webhooks/whatsapp:
 *   post:
 *     summary: Receber evento do webhook WhatsApp
 *     description: >
 *       Recebe eventos do Meta (mensagens, status, templates, etc.).
 *       Roteia internamente pelo campo `changes[].field`.
 *       Atualmente processa apenas eventos do tipo `messages`.
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
 *         description: Evento processado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
whatsappWebhookRouter.post("/", new WhatsappWebhookController().handle);

export { whatsappWebhookRouter };
