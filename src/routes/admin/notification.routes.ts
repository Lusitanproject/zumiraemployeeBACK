import { Router } from "express";

import { CreateNotificationController } from "../../controllers/admin/notifications/CreateNotificationController";
import { CreateNotificationTypeController } from "../../controllers/admin/notifications/CreateNotificationTypeController";
import { DeleteNotificationController } from "../../controllers/admin/notifications/DeleteNotificationController";
import { FindAllNotificationsController } from "../../controllers/admin/notifications/FindAllNotificationsController";
import { FindAllTypesController } from "../../controllers/admin/notifications/FindAllTypesController";
import { FindNotificationTypeController } from "../../controllers/admin/notifications/FindNotificationTypeController";
import { UpdateNotificationController } from "../../controllers/admin/notifications/UpdateNotificationController";
import { UpdateNotificationTypeController } from "../../controllers/admin/notifications/UpdateNotificationTypeController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminNotificationRouter = Router();

/**
 * @swagger
 * /admin/notifications:
 *   get:
 *     summary: "[Admin] Listar todas as notificações"
 *     description: Retorna todas as notificações cadastradas no sistema, incluindo destinatários e tipos.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNotificationRouter.get("/", isAuthenticated, new FindAllNotificationsController().handle);

/**
 * @swagger
 * /admin/notifications/types:
 *   get:
 *     summary: "[Admin] Listar tipos de notificação"
 *     description: >
 *       Retorna todos os tipos de notificação cadastrados.
 *       Tipos definem categorias com cor e prioridade (ex: 'Alerta Crítico', 'Informativo', 'Lembrete').
 *       Use `priority` para ordenar os tipos — maior valor = maior prioridade.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de notificação
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
 *                     $ref: '#/components/schemas/NotificationType'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNotificationRouter.get("/types", isAuthenticated, new FindAllTypesController().handle);

/**
 * @swagger
 * /admin/notifications/types/{id}:
 *   get:
 *     summary: "[Admin] Detalhar tipo de notificação"
 *     description: Retorna os dados de um tipo de notificação específico.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do tipo de notificação
 *     responses:
 *       200:
 *         description: Dados do tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/NotificationType'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNotificationRouter.get("/types/:id", isAuthenticated, new FindNotificationTypeController().handle);

/**
 * @swagger
 * /admin/notifications:
 *   post:
 *     summary: "[Admin] Criar e enviar notificação"
 *     description: >
 *       Cria uma notificação e a envia aos usuários indicados em `userIds`.
 *       `actionUrl` é um deep link opcional para redirecionar o usuário a uma ação específica (ex: ver resultado de avaliação).
 *       `content` é o corpo completo da notificação (pode ser HTML ou texto).
 *       `summary` é o texto curto exibido na listagem (sem formatação).
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - notificationTypeId
 *               - userIds
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *                 description: Resumo curto exibido na listagem (sem formatação)
 *               content:
 *                 type: string
 *                 nullable: true
 *                 description: Corpo completo da notificação (HTML ou texto longo)
 *               actionUrl:
 *                 type: string
 *                 nullable: true
 *                 description: "Deep link para ação relacionada (ex: link para resultado de avaliação)"
 *               notificationTypeId:
 *                 type: string
 *                 format: cuid
 *                 description: ID do tipo/categoria da notificação
 *               userIds:
 *                 type: array
 *                 description: IDs dos usuários destinatários
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Notificação criada e enviada
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNotificationRouter.post("/", isAuthenticated, new CreateNotificationController().handle);

/**
 * @swagger
 * /admin/notifications/types:
 *   post:
 *     summary: "[Admin] Criar tipo de notificação"
 *     description: >
 *       Cria um novo tipo/categoria de notificação.
 *       `color` define a cor de identificação visual (#RRGGBB ou #RGB).
 *       `priority` é um inteiro — quanto maior o valor, mais alta a prioridade.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *               - priority
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nome da categoria (ex:'Alerta Crítico','Informativo')"
 *               color:
 *                 type: string
 *                 pattern: '^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$'
 *                 description: Cor hexadecimal (#RRGGBB ou #RGB)
 *                 example: "#FF0000"
 *               priority:
 *                 type: integer
 *                 description: Prioridade numérica (maior = mais prioritário)
 *     responses:
 *       200:
 *         description: Tipo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/NotificationType'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminNotificationRouter.post("/types", isAuthenticated, new CreateNotificationTypeController().handle);

/**
 * @swagger
 * /admin/notifications/{notificationId}:
 *   put:
 *     summary: "[Admin] Atualizar notificação"
 *     description: Atualiza os dados de uma notificação existente.
 *     tags: [Admin - Notifications]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - notificationTypeId
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *                 nullable: true
 *               actionUrl:
 *                 type: string
 *                 nullable: true
 *               notificationTypeId:
 *                 type: string
 *                 format: cuid
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
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
adminNotificationRouter.put("/:notificationId", isAuthenticated, new UpdateNotificationController().handle);

/**
 * @swagger
 * /admin/notifications/types/{id}:
 *   put:
 *     summary: "[Admin] Atualizar tipo de notificação"
 *     description: Atualiza nome, cor ou prioridade de um tipo de notificação existente.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do tipo de notificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *               - priority
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *                 pattern: '^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$'
 *               priority:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tipo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/NotificationType'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNotificationRouter.put("/types/:id", isAuthenticated, new UpdateNotificationTypeController().handle);

/**
 * @swagger
 * /admin/notifications/{notificationId}:
 *   delete:
 *     summary: "[Admin] Excluir notificação"
 *     description: Remove permanentemente uma notificação e seus registros de destinatários.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da notificação a excluir
 *     responses:
 *       200:
 *         description: Notificação excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminNotificationRouter.delete("/:notificationId", isAuthenticated, new DeleteNotificationController().handle);

export { adminNotificationRouter };
