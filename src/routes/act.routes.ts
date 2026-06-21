import { Router } from "express";

import { AnalysisMessageController } from "../controllers/act/AnalysisMessageController";
import { CompileActChapterController } from "../controllers/act/CompileActChapterController";
import { CreateActChapterController } from "../controllers/act/CreateActChapterController";
import { CreateActController } from "../controllers/act/CreateActController";
import { DeleteActController } from "../controllers/act/DeleteActController";
import { FindActAnalysisController } from "../controllers/act/FindActAnalysisController";
import { FindActAnalysisFactorMessagesController } from "../controllers/act/FindActAnalysisFactorMessagesController";
import { FindActAnalysisSummaryController } from "../controllers/act/FindActAnalysisSummaryController";
import { FindActChatbotController } from "../controllers/act/FindActChatbotController";
import { FindActConfigController } from "../controllers/act/FindActConfigController";
import { FindActsPanelController } from "../controllers/act/FindActsPanelController";
import { FindAvailableActsController } from "../controllers/act/FindAvailableActsController";
import { FindByCompanyController } from "../controllers/act/FindByCompanyController";
import { GetActChapterController } from "../controllers/act/GetActChapterController";
import { GetAnalysisReportController } from "../controllers/act/GetAnalysisReportController";
import { GetAnalysisUserFiltersController } from "../controllers/act/GetAnalysisUserFiltersController";
import { MessageActChatbotController } from "../controllers/act/MessageActChatbotController";
import { TestActController } from "../controllers/act/TestActController";
import { UpdateActChapterController } from "../controllers/act/UpdateActChapterController";
import { UpdateActController } from "../controllers/act/UpdateActController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { requireActAccess } from "../middlewares/requireActAccess";
import { requireCompany } from "../middlewares/requireCompany";
import { requirePermissions } from "../middlewares/requirePermissions";
import { requireSameCompany } from "../middlewares/requireSameCompany";

const actRouter = Router();

/**
 * @swagger
 * /acts:
 *   post:
 *     summary: Criar ACT
 *     description: "Cria um ACT vinculado à empresa do usuário autenticado. Requer permissão `acts-create`."
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
 *               - name
 *               - description
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               published:
 *                 type: boolean
 *               initialMessage:
 *                 type: string
 *               messageInstructions:
 *                 type: string
 *               compilationInstructions:
 *                 type: string
 *               reportGenerationInstructions:
 *                 type: string
 *               reportLookupInstructions:
 *                 type: string
 *               individualAnalysisInstructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: ACT criado com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/",
  isAuthenticated,
  requirePermissions("acts-create"),
  requireCompany,
  new CreateActController().handle,
);

/**
 * @swagger
 * /acts/panel:
 *   get:
 *     summary: Listar ACTs do painel do admin-empresa
 *     description: >
 *       Lista os ACTs exibidos no painel do admin-empresa. O conjunto retornado varia conforme as
 *       permissões do usuário (com deduplicação): `acts-read-company` adiciona todos os ACTs da
 *       empresa, `acts-read-owned` adiciona os ACTs criados pelo próprio usuário, e
 *       `acts-read-platform` adiciona os ACTs da Zumira (sem dono). Requer **pelo menos uma** dessas
 *       três permissões.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ACTs visíveis no painel do admin-empresa
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/panel",
  isAuthenticated,
  requirePermissions(["acts-read-company", "acts-read-owned", "acts-read-platform"], { match: "any" }),
  requireCompany,
  new FindActsPanelController().handle,
);

/**
 * @swagger
 * /acts/available:
 *   get:
 *     summary: Listar ACTs disponíveis para a empresa
 *     description: "Lista ACTs próprios da empresa mais os ACTs da trilha à qual a empresa pertence. Requer permissão `acts-read-available`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ACTs disponíveis
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/available",
  isAuthenticated,
  requirePermissions("acts-read-available"),
  requireCompany,
  new FindAvailableActsController().handle,
);

/**
 * @swagger
 * /acts/by-company:
 *   get:
 *     summary: Listar ACTs de uma empresa
 *     deprecated: true
 *     description: "**Deprecated** — use `GET /acts/available` no lugar. Requer permissão `acts-engage`."
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
 * /acts/message:
 *   post:
 *     summary: Enviar mensagem ao chatbot do ACT
 *     description: >
 *       Envia uma mensagem do usuário ao chatbot de um capítulo de ACT e retorna a resposta via stream SSE.
 *       A mensagem é salva no histórico com `role: "user"` e a resposta com `role: "assistant"` após o stream completar.
 *       Requer permissão `acts-engage`.
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
 *                 description: ID do capítulo ativo
 *               content:
 *                 type: string
 *                 description: Texto da mensagem do usuário
 *     responses:
 *       200:
 *         description: Stream SSE com a resposta da IA
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
 *     summary: Enviar mensagem para análise de ACT (RAG)
 *     description: "Análise por ato: requer pelo menos uma de `acts-read-analysis-company`, `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa."
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Mensagem atual do usuário
 *               messages:
 *                 type: array
 *                 default: []
 *                 description: Histórico anterior (deve terminar com role assistant)
 *                 items:
 *                   type: object
 *                   required:
 *                     - role
 *                     - content
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Stream SSE com a resposta da IA
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post(
  "/:actChatbotId/analysis/message",
  isAuthenticated,
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new AnalysisMessageController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/user-filters:
 *   get:
 *     summary: "[Admin] Filtros de usuário disponíveis na análise"
 *     description: "Análise por ato: requer pelo menos uma de `acts-read-analysis-company`, `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa."
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
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new GetAnalysisUserFiltersController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/summary:
 *   get:
 *     summary: "[Admin] Sumário de scores da análise de ACT"
 *     description: "Análise por ato: requer pelo menos uma de `acts-read-analysis-company`, `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa."
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
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new FindActAnalysisSummaryController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/report:
 *   get:
 *     summary: "[Admin] Obter laudo de análise de ACT"
 *     description: >
 *       Retorna o laudo da análise mais recente de um ACT. Quando o texto qualitativo ainda não foi
 *       gerado (status `PENDING`), a geração roda de forma **síncrona** nesta requisição e o laudo
 *       pronto é retornado na resposta. Se outra requisição já está gerando (status `GENERATING`),
 *       retorna `available: false`. Análise por ato: requer pelo menos uma de `acts-read-analysis-company`,
 *       `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa.
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChatbotId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do ACT
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Laudo de análise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/GenerateAnalysisReportResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:actChatbotId/analysis/report",
  isAuthenticated,
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new GetAnalysisReportController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis/factors/{factorId}/messages:
 *   get:
 *     summary: "[Admin] Listar mensagens de um fator psicossocial na análise"
 *     description: "Análise por ato: requer pelo menos uma de `acts-read-analysis-company`, `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa."
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
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new FindActAnalysisFactorMessagesController().handle,
);

/**
 * @swagger
 * /acts/{actChatbotId}/analysis:
 *   get:
 *     summary: "[Admin] Buscar análise de ACT da empresa"
 *     description: "Análise por ato: requer pelo menos uma de `acts-read-analysis-company`, `acts-read-analysis-owned` ou `acts-read-analysis-platform` (conforme o dono do ato), com `companyId` da própria empresa."
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
  requireActAccess({
    idParam: "actChatbotId",
    company: "acts-read-analysis-company",
    owned: "acts-read-analysis-owned",
    platform: "acts-read-analysis-platform",
  }),
  requireSameCompany(),
  new FindActAnalysisController().handle,
);

/**
 * @swagger
 * /acts/{id}/config:
 *   get:
 *     summary: Buscar configuração completa de ACT próprio
 *     description: "Retorna todos os campos de configuração do ACT. Funciona para ACTs da empresa (`acts-update-company`) ou criados pelo próprio usuário (`acts-update-owned`); nunca para ACTs Zumira. Requer **pelo menos uma** dessas permissões."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Configuração completa do ACT
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.get(
  "/:id/config",
  isAuthenticated,
  requireActAccess({ company: "acts-update-company", owned: "acts-update-owned" }),
  new FindActConfigController().handle,
);

/**
 * @swagger
 * /acts/test-message:
 *   post:
 *     summary: Testar mensagem de chatbot
 *     description: "Envia instruções e um histórico de mensagens para a IA e retorna a resposta via stream. Não persiste nada nem requer um ACT existente. Requer permissão `acts-test`."
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Mensagem atual do usuário
 *               instructions:
 *                 type: string
 *               messages:
 *                 type: array
 *                 default: []
 *                 description: Histórico anterior (deve terminar com role assistant)
 *                 items:
 *                   type: object
 *                   required:
 *                     - role
 *                     - content
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Stream SSE com a resposta da IA
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.post("/test-message", isAuthenticated, requirePermissions("acts-test"), new TestActController().handle);

/**
 * @swagger
 * /acts/{id}:
 *   put:
 *     summary: Atualizar ACT
 *     description: "Atualiza um ACT da empresa (`acts-update-company`) ou criado pelo próprio usuário (`acts-update-owned`). ACTs Zumira (sem dono) nunca podem ser editados por aqui. Requer **pelo menos uma** dessas permissões."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: ACT atualizado com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.put(
  "/:id",
  isAuthenticated,
  requireActAccess({ company: "acts-update-company", owned: "acts-update-owned" }),
  new UpdateActController().handle,
);

/**
 * @swagger
 * /acts/{id}:
 *   delete:
 *     summary: Deletar ACT
 *     description: "Deleta um ACT da empresa (`acts-delete-company`) ou criado pelo próprio usuário (`acts-delete-owned`). ACTs Zumira (sem dono) nunca podem ser deletados por aqui. Requer **pelo menos uma** dessas permissões."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: ACT deletado com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
actRouter.delete(
  "/:id",
  isAuthenticated,
  requireActAccess({ company: "acts-delete-company", owned: "acts-delete-owned" }),
  new DeleteActController().handle,
);

/**
 * @swagger
 * /acts/{id}:
 *   get:
 *     summary: Detalhar ACT
 *     description: "Requer permissão `acts-engage`."
 *     tags: [ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
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
