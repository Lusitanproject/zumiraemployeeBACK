import { Router } from "express";

import { IntegrationCompileActChapterController } from "../../controllers/integration/act/CompileActChapterController";
import { IntegrationCreateActChapterController } from "../../controllers/integration/act/CreateActChapterController";
import { IntegrationGetActChapterController } from "../../controllers/integration/act/GetActChapterController";
import { IntegrationGetActsDataController } from "../../controllers/integration/act/GetActsDataController";
import { IntegrationGetFullStoryController } from "../../controllers/integration/act/GetFullStoryController";
import { IntegrationMessageActChatbotController } from "../../controllers/integration/act/MessageActChatbotController";
import { IntegrationMoveToNextActController } from "../../controllers/integration/act/MoveToNextActController";
import { IntegrationUpdateActChapterController } from "../../controllers/integration/act/UpdateActChapterController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const integrationActsRoutes = Router();

/**
 * @swagger
 * /integrations/acts:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/acts
 *     description: Valida query.userId e retorna dados do usuario na trilha atual com chatbots, capitulos e progresso.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                   required: [chatbots, chapters, progress]
 *                   properties:
 *                     chatbots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, name, description, icon, index, locked, current]
 *                         properties:
 *                           id: { type: string }
 *                           name: { type: string }
 *                           description: { type: string }
 *                           icon: { type: string }
 *                           index: { type: integer }
 *                           locked: { type: boolean }
 *                           current: { type: boolean }
 *                     chapters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, title, actChatbotId, createdAt, updatedAt]
 *                         properties:
 *                           id: { type: string }
 *                           title: { type: string }
 *                           actChatbotId: { type: string }
 *                           createdAt: { type: string, format: date-time }
 *                           updatedAt: { type: string, format: date-time }
 *                     progress:
 *                       type: number
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.get("/", isAuthenticated, new IntegrationGetActsDataController().handle);

/**
 * @swagger
 * /integrations/acts/chapters:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/acts/chapters
 *     description: Valida query.userId e query.actChapterId, busca capitulo e mensagens desse capitulo para o usuario informado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
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
 *                   required: [id, title, compilation, actChatbot, messages]
 *                   properties:
 *                     id: { type: string }
 *                     title: { type: string }
 *                     compilation:
 *                       type: string
 *                       nullable: true
 *                     actChatbot:
 *                       type: object
 *                       required: [id, description, icon, name]
 *                       properties:
 *                         id: { type: string }
 *                         description: { type: string }
 *                         icon: { type: string }
 *                         name: { type: string }
 *                         initialMessage:
 *                           type: string
 *                           nullable: true
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [content, role, createdAt, updatedAt]
 *                         properties:
 *                           content: { type: string }
 *                           role:
 *                             type: string
 *                             enum: [user, assistant]
 *                           createdAt: { type: string, format: date-time }
 *                           updatedAt: { type: string, format: date-time }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.get("/chapters", isAuthenticated, new IntegrationGetActChapterController().handle);

/**
 * @swagger
 * /integrations/acts/next:
 *   put:
 *     tags: [Integrations]
 *     summary: PUT /integrations/acts/next
 *     description: Valida query.userId e tenta avancar o usuario para o proximo act chatbot da trilha.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                   required: [currActChatbotId]
 *                   properties:
 *                     currActChatbotId:
 *                       type: string
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.put("/next", isAuthenticated, new IntegrationMoveToNextActController().handle);

/**
 * @swagger
 * /integrations/acts/message:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/acts/message
 *     description: Valida query.userId e body (actChapterId, content), grava mensagem do usuario, gera resposta da IA e salva mensagem assistant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actChapterId, content]
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 minLength: 1
 *               content:
 *                 type: string
 *                 minLength: 1
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
 *                   type: string
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.post("/message", isAuthenticated, new IntegrationMessageActChatbotController().handle);

/**
 * @swagger
 * /integrations/acts/new-chapter:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/acts/new-chapter
 *     description: Valida query.userId e body (actChatbotId, type), remove capitulos vazios do usuario e cria novo capitulo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actChatbotId, type]
 *             properties:
 *               actChatbotId:
 *                 type: string
 *                 minLength: 1
 *               type:
 *                 type: string
 *                 enum: [REGULAR, ADMIN_TEST]
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
 *                   required: [id, actChatbot]
 *                   properties:
 *                     id: { type: string }
 *                     actChatbot:
 *                       type: object
 *                       required: [name, icon, description]
 *                       properties:
 *                         name: { type: string }
 *                         icon: { type: string }
 *                         description: { type: string }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.post("/new-chapter", isAuthenticated, new IntegrationCreateActChapterController().handle);

/**
 * @swagger
 * /integrations/acts/chapters/compile:
 *   post:
 *     tags: [Integrations]
 *     summary: POST /integrations/acts/chapters/compile
 *     description: Valida query.userId e body.actChapterId, compila o capitulo usando as mensagens e salva o texto em compilation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actChapterId]
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 minLength: 1
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
 *                   required: [id, title, actChatbotId, userId, type, createdAt, updatedAt]
 *                   properties:
 *                     id: { type: string }
 *                     title: { type: string }
 *                     compilation:
 *                       type: string
 *                       nullable: true
 *                     actChatbotId: { type: string }
 *                     userId: { type: string }
 *                     type:
 *                       type: string
 *                       enum: [REGULAR, ADMIN_TEST]
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.post("/chapters/compile", isAuthenticated, new IntegrationCompileActChapterController().handle);

/**
 * @swagger
 * /integrations/acts/chapters/{actChapterId}:
 *   put:
 *     tags: [Integrations]
 *     summary: PUT /integrations/acts/chapters/{actChapterId}
 *     description: Valida query.userId e body (actChapterId, title opcional, compilation opcional) e atualiza o capitulo do usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actChapterId]
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 minLength: 1
 *               title:
 *                 type: string
 *                 minLength: 1
 *               compilation:
 *                 type: string
 *                 nullable: true
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
 *                   required: [id, title, actChatbotId, userId, type, createdAt, updatedAt]
 *                   properties:
 *                     id: { type: string }
 *                     title: { type: string }
 *                     compilation:
 *                       type: string
 *                       nullable: true
 *                     actChatbotId: { type: string }
 *                     userId: { type: string }
 *                     type:
 *                       type: string
 *                       enum: [REGULAR, ADMIN_TEST]
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.put(
  "/chapters/:actChapterId",
  isAuthenticated,
  new IntegrationUpdateActChapterController().handle,
);

/**
 * @swagger
 * /integrations/acts/full-story:
 *   get:
 *     tags: [Integrations]
 *     summary: GET /integrations/acts/full-story
 *     description: Valida query.userId e retorna capitulos REGULAR com compilation preenchida para a trilha do usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                   required: [chapters]
 *                   properties:
 *                     chapters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id, title, compilation, createdAt, updatedAt, actChatbot]
 *                         properties:
 *                           id: { type: string }
 *                           title: { type: string }
 *                           compilation:
 *                             type: string
 *                             nullable: true
 *                           createdAt: { type: string, format: date-time }
 *                           updatedAt: { type: string, format: date-time }
 *                           actChatbot:
 *                             type: object
 *                             required: [index, name]
 *                             properties:
 *                               index: { type: integer }
 *                               name: { type: string }
 *       400:
 *         description: PublicError
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
integrationActsRoutes.get("/full-story", isAuthenticated, new IntegrationGetFullStoryController().handle);

export { integrationActsRoutes };
