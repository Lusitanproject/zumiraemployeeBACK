"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const DetailNotificationController_1 = require("../controllers/notification/DetailNotificationController");
const ListNotificationsController_1 = require("../controllers/notification/ListNotificationsController");
const ReadNotificationController_1 = require("../controllers/notification/ReadNotificationController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const notificationRouter = (0, express_1.Router)();
exports.notificationRouter = notificationRouter;
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Listar notificações do usuário
 *     description: >
 *       Retorna as notificações do usuário autenticado.
 *       `filter: "recent"` retorna as últimas notificações, ordenadas por data.
 *       `filter: "unread"` retorna somente as notificações ainda não lidas.
 *       O parâmetro `max` limita a quantidade de resultados.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [recent, unread]
 *         description: "recent = últimas notificações por data; unread = somente não lidas"
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de notificações a retornar
 *     responses:
 *       200:
 *         description: Lista de notificações
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
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
notificationRouter.get("/", isAuthenticated_1.isAuthenticated, new ListNotificationsController_1.ListNotificationsController().handle);
/**
 * @swagger
 * /notifications/{notificationId}:
 *   get:
 *     summary: Detalhar notificação
 *     description: Retorna os dados completos de uma notificação específica do usuário autenticado, incluindo o conteúdo completo e a URL de ação.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Detalhes da notificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
notificationRouter.get("/:notificationId", isAuthenticated_1.isAuthenticated, new DetailNotificationController_1.DetailNotificationController().handle);
/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Marcar notificação como lida
 *     description: Marca a notificação indicada como lida para o usuário autenticado. Atualiza o campo `read` em `NotificationRecipient`.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da notificação a marcar como lida
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
notificationRouter.put("/:notificationId/read", isAuthenticated_1.isAuthenticated, new ReadNotificationController_1.ReadNotificationController().handle);
