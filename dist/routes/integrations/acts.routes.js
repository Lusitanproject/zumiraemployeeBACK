"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationActsRoutes = void 0;
const express_1 = require("express");
const CompileActChapterController_1 = require("../../controllers/integration/act/CompileActChapterController");
const CreateActChapterController_1 = require("../../controllers/integration/act/CreateActChapterController");
const GetActChapterController_1 = require("../../controllers/integration/act/GetActChapterController");
const GetActsDataController_1 = require("../../controllers/integration/act/GetActsDataController");
const GetFullStoryController_1 = require("../../controllers/integration/act/GetFullStoryController");
const MessageActChatbotController_1 = require("../../controllers/integration/act/MessageActChatbotController");
const MoveToNextActController_1 = require("../../controllers/integration/act/MoveToNextActController");
const UpdateActChapterController_1 = require("../../controllers/integration/act/UpdateActChapterController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const integrationActsRoutes = (0, express_1.Router)();
exports.integrationActsRoutes = integrationActsRoutes;
/**
 * @swagger
 * /integrations/acts:
 *   get:
 *     tags: [Integrations]
 *     summary: Obter visao geral da trilha ACT do usuario
 *     description: Retorna uma visao geral da trilha ACT do usuario, com chatbots, capitulos e progresso. Internamente, identifica a etapa atual da jornada, quais itens estao desbloqueados e calcula o avanco para orientar os proximos passos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono da trilha ACT que sera consultada.
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
integrationActsRoutes.get("/", isAuthenticated_1.isAuthenticated, new GetActsDataController_1.IntegrationGetActsDataController().handle);
/**
 * @swagger
 * /integrations/acts/chapters:
 *   get:
 *     tags: [Integrations]
 *     summary: Consultar capitulo da trilha com historico de conversa
 *     description: Retorna os dados de um capitulo especifico da trilha do usuario, incluindo mensagens ja trocadas. Internamente, valida se o capitulo pertence ao usuario informado e monta o contexto completo para continuidade da conversa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono do capitulo consultado.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: actChapterId
 *         description: ID do capitulo da trilha ACT que deve ser carregado.
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
integrationActsRoutes.get("/chapters", isAuthenticated_1.isAuthenticated, new GetActChapterController_1.IntegrationGetActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/next:
 *   put:
 *     tags: [Integrations]
 *     summary: Avancar usuario para o proximo chatbot da trilha
 *     description: Tenta mover o usuario para a proxima etapa da trilha ACT. Internamente, verifica as regras de progressao da jornada e, quando elegivel, atualiza o chatbot atual do usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario que tera a progressao da trilha avaliada.
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
integrationActsRoutes.put("/next", isAuthenticated_1.isAuthenticated, new MoveToNextActController_1.IntegrationMoveToNextActController().handle);
/**
 * @swagger
 * /integrations/acts/message:
 *   post:
 *     tags: [Integrations]
 *     summary: Enviar mensagem no capitulo e receber resposta do assistente
 *     description: Registra uma nova mensagem do usuario no capitulo informado e retorna a resposta do assistente. Internamente, valida o vinculo do capitulo com o usuario, salva a mensagem enviada, gera a resposta por IA e persiste essa resposta no historico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario que esta interagindo no capitulo.
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
 *                 description: ID do capitulo onde a mensagem sera registrada.
 *                 type: string
 *                 minLength: 1
 *               content:
 *                 description: Texto da mensagem enviada pelo usuario.
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
integrationActsRoutes.post("/message", isAuthenticated_1.isAuthenticated, new MessageActChatbotController_1.IntegrationMessageActChatbotController().handle);
/**
 * @swagger
 * /integrations/acts/new-chapter:
 *   post:
 *     tags: [Integrations]
 *     summary: Criar novo capitulo na trilha ACT
 *     description: Cria um novo capitulo para o chatbot informado dentro da trilha do usuario. Internamente, remove capitulos vazios anteriores para evitar ruido no historico e inicia um novo espaco de conversa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario para o qual o novo capitulo sera criado.
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
 *                 description: ID do chatbot da trilha que sera associado ao novo capitulo.
 *                 type: string
 *                 minLength: 1
 *               type:
 *                 description: Tipo do capitulo a ser criado (uso normal ou teste administrativo).
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
integrationActsRoutes.post("/new-chapter", isAuthenticated_1.isAuthenticated, new CreateActChapterController_1.IntegrationCreateActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/chapters/compile:
 *   post:
 *     tags: [Integrations]
 *     summary: Compilar capitulo em resumo consolidado
 *     description: Gera uma compilacao textual do capitulo a partir das mensagens ja registradas. Internamente, reune o historico da conversa, produz um resumo consolidado e salva esse conteudo no campo de compilacao do capitulo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono do capitulo a ser compilado.
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
 *                 description: ID do capitulo que tera o texto de compilacao gerado.
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
integrationActsRoutes.post("/chapters/compile", isAuthenticated_1.isAuthenticated, new CompileActChapterController_1.IntegrationCompileActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/chapters/{actChapterId}:
 *   put:
 *     tags: [Integrations]
 *     summary: Atualizar dados de um capitulo da trilha
 *     description: Atualiza informacoes de um capitulo da trilha do usuario, como titulo e texto de compilacao. Internamente, garante que o capitulo pertence ao usuario informado e aplica apenas os campos enviados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChapterId
 *         description: ID do capitulo na URL que sera atualizado.
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: userId
 *         description: ID do usuario dono do capitulo que esta sendo alterado.
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
 *                 description: ID do capitulo no corpo da requisicao (deve corresponder ao capitulo a ser atualizado).
 *                 type: string
 *                 minLength: 1
 *               title:
 *                 description: Novo titulo do capitulo.
 *                 type: string
 *                 minLength: 1
 *               compilation:
 *                 description: Texto consolidado do capitulo apos a revisao/edicao.
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
integrationActsRoutes.put("/chapters/:actChapterId", isAuthenticated_1.isAuthenticated, new UpdateActChapterController_1.IntegrationUpdateActChapterController().handle);
/**
 * @swagger
 * /integrations/acts/full-story:
 *   get:
 *     tags: [Integrations]
 *     summary: Listar historia completa compilada da trilha
 *     description: Retorna a historia completa da trilha ACT do usuario com os capitulos regulares ja compilados. Internamente, filtra apenas capitulos com conteudo consolidado para montar uma narrativa continua da jornada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: ID do usuario cuja historia consolidada sera retornada.
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
integrationActsRoutes.get("/full-story", isAuthenticated_1.isAuthenticated, new GetFullStoryController_1.IntegrationGetFullStoryController().handle);
