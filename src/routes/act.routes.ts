import { Router } from "express";

import { AnalysisMessageController } from "../controllers/act/AnalysisMessageController";
import { CompileActChapterController } from "../controllers/act/CompileActChapterController";
import { CreateActChapterController } from "../controllers/act/CreateActChapterController";
import { FindActAnalysisController } from "../controllers/act/FindActAnalysisController";
import { FindActAnalysisFactorMessagesController } from "../controllers/act/FindActAnalysisFactorMessagesController";
import { FindActAnalysisSummaryController } from "../controllers/act/FindActAnalysisSummaryController";
import { FindActChatbotController } from "../controllers/act/FindActChatbotController";
import { FindByCompanyController } from "../controllers/act/FindByCompanyController";
import { GenerateAnalysisReportController } from "../controllers/act/GenerateAnalysisReportController";
import { GetActChapterController } from "../controllers/act/GetActChapterController";
import { GetActsDataController } from "../controllers/act/GetActsDataController";
import { GetAnalysisUserFiltersController } from "../controllers/act/GetAnalysisUserFiltersController";
import { GetFullStoryController } from "../controllers/act/GetFullStoryController";
import { MessageActChatbotController } from "../controllers/act/MessageActChatbotController";
import { MoveToNextActController } from "../controllers/act/MoveToNextActController";
import { UpdateActChapterController } from "../controllers/act/UpdateActChapterController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { requirePermissions } from "../middlewares/requirePermissions";
import { requireSameCompany } from "../middlewares/requireSameCompany";

const actRouter = Router();

/**
 * @swagger
 * /acts/by-company:
 *   get:
 *     summary: Listar ACTs de uma empresa
 *     description: "Requer permissão `answer-act`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ACTs disponíveis para a empresa
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get("/by-company", isAuthenticated, requirePermissions("acts-engage"), new FindByCompanyController().handle);

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
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get("/", isAuthenticated, requirePermissions("acts-engage"), new GetActsDataController().handle);

/**
 * @swagger
 * /acts/chapters:
 *   get:
 *     summary: Buscar capítulo de ACT com mensagens
 *     description: >
 *       Retorna os dados de um capítulo específico, incluindo o histórico de mensagens da conversa.
 *       Um capítulo (`ActChapter`) é a sessão individual de um usuário com um ACT.
 *       O histórico de mensagens inclui tanto as mensagens do usuário quanto as respostas do chatbot.
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.get("/chapters", isAuthenticated, requirePermissions("acts-engage"), new GetActChapterController().handle);

/**
 * @swagger
 * /acts/full-story:
 *   get:
 *     summary: Obter história completa compilada do usuário
 *     description: >
 *       Retorna a narrativa completa do usuário — a compilação de todos os capítulos já concluídos.
 *       Cada capítulo tem um campo `compilation` com a narrativa compilada pela IA.
 *       Este endpoint agrega todos os capítulos compilados do usuário na trilha atual.
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get("/full-story", isAuthenticated, requirePermissions("acts-engage"), new GetFullStoryController().handle);

/**
 * @swagger
 * /acts/next:
 *   put:
 *     summary: Avançar para o próximo ACT
 *     description: >
 *       Avança o progresso do usuário para o próximo ACT na trilha.
 *       Atualiza o campo `currentActChatbotId` do usuário para apontar para o próximo ACT disponível.
 *       Deve ser chamado após a conclusão do ACT atual.
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.put("/next", isAuthenticated, requirePermissions("acts-engage"), new MoveToNextActController().handle);

/**
 * @swagger
 * /acts/message:
 *   post:
 *     summary: Enviar mensagem ao chatbot do ACT
 *     description: >
 *       Envia uma mensagem do usuário ao chatbot de um capítulo de ACT e retorna a resposta da IA.
 *       A mensagem é salva no histórico do capítulo com `role: "user"`, e a resposta com `role: "assistant"`.
 *       A IA utiliza as `messageInstructions` do ACT e o histórico anterior do capítulo como contexto.
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/message",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new MessageActChatbotController().handle,
);

/**
 * @swagger
 * /acts/new-chapter:
 *   post:
 *     summary: Criar novo capítulo de ACT
 *     description: >
 *       Inicia um novo capítulo para o usuário num ACT específico.
 *       Sempre cria um capítulo do tipo `REGULAR`.
 *       Requer permissão `answer-act`.
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
 *             properties:
 *               actChatbotId:
 *                 type: string
 *                 format: cuid
 *                 description: ID do ACT para o qual criar o capítulo
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/new-chapter",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new CreateActChapterController().handle,
);

/**
 * @swagger
 * /acts/chapters/compile:
 *   post:
 *     summary: Compilar capítulo de ACT
 *     description: >
 *       Dispara a compilação do capítulo via IA, gerando a narrativa final a partir do histórico de mensagens.
 *       A IA usa as `compilationInstructions` do ACT para transformar a conversa em texto narrativo.
 *       O resultado é salvo no campo `compilation` do capítulo (anteriormente `null`).
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/chapters/compile",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new CompileActChapterController().handle,
);

/**
 * @swagger
 * /acts/chapters/{actChapterId}:
 *   put:
 *     summary: Atualizar capítulo de ACT
 *     description: >
 *       Atualiza o título ou a compilação de um capítulo. Permite ao usuário ou admin editar manualmente a narrativa compilada.
 *       Requer permissão `answer-act`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actRouter.put(
  "/chapters/:actChapterId",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new UpdateActChapterController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/message:
 *   post:
 *     summary: "[Admin] Analisar mensagem de ACT"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Análise gerada
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/:actChatbotId/analysis/message",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new AnalysisMessageController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/user-filters:
 *   get:
 *     summary: "[Admin] Filtros de usuário disponíveis na análise"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtros disponíveis
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis/user-filters",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new GetAnalysisUserFiltersController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/summary:
 *   get:
 *     summary: "[Admin] Sumário de scores da análise de ACT"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scores consolidados
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis/summary",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new FindActAnalysisSummaryController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/report:
 *   get:
 *     summary: "[Admin] Obter relatório de análise de ACT"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de análise
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis/report",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new GenerateAnalysisReportController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/factors/{factorId}/messages:
 *   get:
 *     summary: "[Admin] Listar mensagens de um fator psicossocial na análise"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagens associadas ao fator
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis/factors/:factorId/messages",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new FindActAnalysisFactorMessagesController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis:
 *   get:
 *     summary: "[Admin] Buscar análise de ACT da empresa"
 *     description: "Requer permissão `manage-acts`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens paginados da análise
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis",
  isAuthenticated,
  requirePermissions("acts-read-analysis"),
  requireSameCompany(),
  new FindActAnalysisController().handle,
);

/**
 * @swagger
 * /acts/{id}:
 *   get:
 *     summary: Detalhar ACT
 *     description: "Requer permissão `answer-act`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do ACT
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get("/:id", isAuthenticated, requirePermissions("acts-engage"), new FindActChatbotController().handle);

export { actRouter };
