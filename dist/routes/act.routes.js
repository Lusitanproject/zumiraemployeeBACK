"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actRouter = void 0;
const express_1 = require("express");
const CompileActChapterController_1 = require("../controllers/act/CompileActChapterController");
const CreateActChapterController_1 = require("../controllers/act/CreateActChapterController");
const FindActAnalysisController_1 = require("../controllers/act/FindActAnalysisController");
const FindActAnalysisFactorMessagesController_1 = require("../controllers/act/FindActAnalysisFactorMessagesController");
const FindActAnalysisSummaryController_1 = require("../controllers/act/FindActAnalysisSummaryController");
const FindActChatbotController_1 = require("../controllers/act/FindActChatbotController");
const FindByCompanyController_1 = require("../controllers/act/FindByCompanyController");
const GenerateAnalysisReportController_1 = require("../controllers/act/GenerateAnalysisReportController");
const GetActChapterController_1 = require("../controllers/act/GetActChapterController");
const GetActsDataController_1 = require("../controllers/act/GetActsDataController");
const GetAnalysisUserFiltersController_1 = require("../controllers/act/GetAnalysisUserFiltersController");
const GetFullStoryController_1 = require("../controllers/act/GetFullStoryController");
const MessageActChatbotController_1 = require("../controllers/act/MessageActChatbotController");
const MoveToNextActController_1 = require("../controllers/act/MoveToNextActController");
const UpdateActChapterController_1 = require("../controllers/act/UpdateActChapterController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const actRouter = (0, express_1.Router)();
exports.actRouter = actRouter;
/**
 * @swagger
 * /acts/by-company:
 *   get:
 *     summary: Listar ACTs de uma empresa
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ACTs disponíveis para a empresa
 */
actRouter.get("/by-company", isAuthenticated_1.isAuthenticated, new FindByCompanyController_1.FindByCompanyController().handle);
/**
 * @swagger
 * /acts:
 *   get:
 *     summary: Listar ACTs da trilha do usuário
 *     description: >
 *       Retorna os ACTs (atividades narrativas interativas) disponíveis para o usuário autenticado,
 *       com base na trilha da empresa à qual ele pertence.
 *       Cada ACT representa uma narrativa reflexiva/terapêutica que o usuário realiza em capítulos.
 *       Inclui o progresso atual do usuário em cada ACT.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ACTs com progresso do usuário
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
 *                     $ref: '#/components/schemas/ActChatbot'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
actRouter.get("/", isAuthenticated_1.isAuthenticated, new GetActsDataController_1.GetActsDataController().handle);
/**
 * @swagger
 * /acts/chapters:
 *   get:
 *     summary: Buscar capítulo de ACT com mensagens
 *     description: >
 *       Retorna os dados de um capítulo específico, incluindo o histórico de mensagens da conversa.
 *       Um capítulo (`ActChapter`) é a sessão individual de um usuário com um ACT.
 *       O histórico de mensagens inclui tanto as mensagens do usuário quanto as respostas do chatbot.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do capítulo a buscar
 *     responses:
 *       200:
 *         description: Dados do capítulo com histórico de mensagens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/ActChapter'
 *                     - type: object
 *                       properties:
 *                         messages:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ActChapterMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.get("/chapters", isAuthenticated_1.isAuthenticated, new GetActChapterController_1.GetActChapterController().handle);
/**
 * @swagger
 * /acts/full-story:
 *   get:
 *     summary: Obter história completa compilada do usuário
 *     description: >
 *       Retorna a narrativa completa do usuário — a compilação de todos os capítulos já concluídos.
 *       Cada capítulo tem um campo `compilation` com a narrativa compilada pela IA.
 *       Este endpoint agrega todos os capítulos compilados do usuário na trilha atual.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Narrativa completa compilada
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
 *                     chapters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActChapter'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
actRouter.get("/full-story", isAuthenticated_1.isAuthenticated, new GetFullStoryController_1.GetFullStoryController().handle);
/**
 * @swagger
 * /acts/next:
 *   put:
 *     summary: Avançar para o próximo ACT
 *     description: >
 *       Avança o progresso do usuário para o próximo ACT na trilha.
 *       Atualiza o campo `currentActChatbotId` do usuário para apontar para o próximo ACT disponível.
 *       Deve ser chamado após a conclusão do ACT atual.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário avançado para o próximo ACT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChatbot'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.put("/next", isAuthenticated_1.isAuthenticated, new MoveToNextActController_1.MoveToNextActController().handle);
/**
 * @swagger
 * /acts/message:
 *   post:
 *     summary: Enviar mensagem ao chatbot do ACT
 *     description: >
 *       Envia uma mensagem do usuário ao chatbot de um capítulo de ACT e retorna a resposta da IA.
 *       A mensagem é salva no histórico do capítulo com `role: "user"`, e a resposta com `role: "assistant"`.
 *       A IA utiliza as `messageInstructions` do ACT e o histórico anterior do capítulo como contexto.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChapterId
 *               - content
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 format: cuid
 *                 description: ID do capítulo ativo em que o usuário está conversando
 *               content:
 *                 type: string
 *                 description: Texto da mensagem enviada pelo usuário
 *     responses:
 *       200:
 *         description: Resposta do chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapterMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
actRouter.post("/message", isAuthenticated_1.isAuthenticated, new MessageActChatbotController_1.MessageActChatbotController().handle);
/**
 * @swagger
 * /acts/new-chapter:
 *   post:
 *     summary: Criar novo capítulo de ACT
 *     description: >
 *       Inicia um novo capítulo para o usuário num ACT específico.
 *       `type: "REGULAR"` cria um capítulo normal de usuário.
 *       `type: "ADMIN_TEST"` cria um capítulo de teste para administradores validarem o chatbot sem afetar dados reais.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChatbotId
 *               - type
 *             properties:
 *               actChatbotId:
 *                 type: string
 *                 format: cuid
 *                 description: ID do ACT para o qual criar o capítulo
 *               type:
 *                 type: string
 *                 enum: [REGULAR, ADMIN_TEST]
 *                 description: "REGULAR = capítulo real de usuário; ADMIN_TEST = capítulo de teste administrativo"
 *     responses:
 *       200:
 *         description: Capítulo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
actRouter.post("/new-chapter", isAuthenticated_1.isAuthenticated, new CreateActChapterController_1.CreateActChapterController().handle);
/**
 * @swagger
 * /acts/chapters/compile:
 *   post:
 *     summary: Compilar capítulo de ACT
 *     description: >
 *       Dispara a compilação do capítulo via IA, gerando a narrativa final a partir do histórico de mensagens.
 *       A IA usa as `compilationInstructions` do ACT para transformar a conversa em texto narrativo.
 *       O resultado é salvo no campo `compilation` do capítulo (anteriormente `null`).
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actChapterId
 *             properties:
 *               actChapterId:
 *                 type: string
 *                 format: cuid
 *                 description: ID do capítulo a ser compilado
 *     responses:
 *       200:
 *         description: Compilação gerada e salva no capítulo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
actRouter.post("/chapters/compile", isAuthenticated_1.isAuthenticated, new CompileActChapterController_1.CompileActChapterController().handle);
/**
 * @swagger
 * /acts/chapters/{actChapterId}:
 *   put:
 *     summary: Atualizar capítulo de ACT
 *     description: Atualiza o título ou a compilação de um capítulo. Permite ao usuário ou admin editar manualmente a narrativa compilada.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do capítulo a atualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título do capítulo
 *               compilation:
 *                 type: string
 *                 nullable: true
 *                 description: Narrativa compilada (pode ser editada manualmente ou definida como null para limpar)
 *     responses:
 *       200:
 *         description: Capítulo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/ActChapter'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.put("/chapters/:actChapterId", isAuthenticated_1.isAuthenticated, new UpdateActChapterController_1.UpdateActChapterController().handle);
/**
 * @swagger
 * /acts/{id}/analysis/user-filters:
 *   get:
 *     summary: Filtros de usuário disponíveis na análise
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtros disponíveis
 */
actRouter.get("/:actChatbotId/analysis/user-filters", isAuthenticated_1.isAuthenticated, new GetAnalysisUserFiltersController_1.GetAnalysisUserFiltersController().handle);
/**
 * @swagger
 * /acts/{id}/analysis/summary:
 *   get:
 *     summary: Sumário de scores da análise de ACT
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scores consolidados
 */
actRouter.get("/:actChatbotId/analysis/summary", isAuthenticated_1.isAuthenticated, new FindActAnalysisSummaryController_1.FindActAnalysisSummaryController().handle);
/**
 * @swagger
 * /acts/{actChatbotId}/analysis/report:
 *   get:
 *     summary: Obter relatório de análise de ACT
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de análise
 */
actRouter.get("/:actChatbotId/analysis/report", isAuthenticated_1.isAuthenticated, new GenerateAnalysisReportController_1.GenerateAnalysisReportController().handle);
/**
 * @swagger
 * /acts/{actChatbotId}/analysis/factors/{factorId}/messages:
 *   get:
 *     summary: Listar mensagens de um fator psicossocial na análise
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagens associadas ao fator
 */
actRouter.get("/:actChatbotId/analysis/factors/:factorId/messages", isAuthenticated_1.isAuthenticated, new FindActAnalysisFactorMessagesController_1.FindActAnalysisFactorMessagesController().handle);
/**
 * @swagger
 * /acts/{actChatbotId}/analysis:
 *   get:
 *     summary: Buscar análise de ACT da empresa
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens paginados da análise
 */
actRouter.get("/:actChatbotId/analysis", isAuthenticated_1.isAuthenticated, new FindActAnalysisController_1.FindActAnalysisController().handle);
/**
 * @swagger
 * /acts/{id}:
 *   get:
 *     summary: Detalhar ACT
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do ACT
 */
actRouter.get("/:id", isAuthenticated_1.isAuthenticated, new FindActChatbotController_1.FindActChatbotController().handle);
