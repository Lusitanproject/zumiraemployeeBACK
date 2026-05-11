import { Router } from "express";

import { CreateActChatbotController } from "../../controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "../../controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "../../controllers/admin/acts/FindAllActChatbotsController";
import { FindByCompanyController } from "../../controllers/admin/acts/FindByCompanyController";
import { FindByTrailController } from "../../controllers/admin/acts/FindByTrailController";
import { ImportChatbaseChaptersController } from "../../controllers/admin/acts/ImportChatbaseChaptersController";
import { UpdateActChatbotController } from "../../controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "../../controllers/admin/acts/UpdateManyActChatbotsController";
import { FindActAnalysisController } from "../../controllers/admin/acts/analysis/FindActAnalysisController";
import { FindActAnalysisFactorMessagesController } from "../../controllers/admin/acts/analysis/FindActAnalysisFactorMessagesController";
import { FindActAnalysisSummaryController } from "../../controllers/admin/acts/analysis/FindActAnalysisSummaryController";
import { GenerateActAnalysisController } from "../../controllers/admin/acts/analysis/GenerateActAnalysisController";
import { GenerateAnalysisReportController } from "../../controllers/admin/acts/analysis/GenerateAnalysisReportController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminActRouter = Router();

/**
 * @swagger
 * /admin/acts:
 *   get:
 *     summary: "[Admin] Listar todos os ACTs"
 *     description: Retorna todos os chatbots narrativos (ACTs) cadastrados no sistema, independente de trilha ou empresa.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ACTs
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
adminActRouter.get("/", isAuthenticated, new FindAllActChatbotsController().handle);

/**
 * @swagger
 * /admin/acts/by-trail:
 *   get:
 *     summary: "[Admin] Listar ACTs de uma trilha"
 *     description: Retorna os ACTs pertencentes a uma trilha específica, ordenados por `index`.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha
 *     responses:
 *       200:
 *         description: ACTs da trilha
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
adminActRouter.get("/by-trail", isAuthenticated, new FindByTrailController().handle);

/**
 * @swagger
 * /admin/acts/by-company:
 *   get:
 *     summary: "[Admin] Listar ACTs de uma empresa"
 *     description: Retorna os ACTs disponíveis para os usuários de uma empresa específica (via trilha vinculada à empresa).
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: ACTs disponíveis para a empresa
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
adminActRouter.get("/by-company", isAuthenticated, new FindByCompanyController().handle);

/**
 * @swagger
 * /admin/acts/update-many:
 *   put:
 *     summary: "[Admin] Atualizar múltiplos ACTs em lote"
 *     description: >
 *       Atualiza vários ACTs de uma vez. Útil para reordenar ACTs dentro de uma trilha (alterar o campo `index` de vários ao mesmo tempo).
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatbots
 *             properties:
 *               chatbots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     icon:
 *                       type: string
 *                     trailId:
 *                       type: string
 *                       format: cuid
 *                     index:
 *                       type: integer
 *                       description: Posição de ordenação (0-based) dentro da trilha
 *                     initialMessage:
 *                       type: string
 *                       nullable: true
 *                     messageInstructions:
 *                       type: string
 *                       nullable: true
 *                     compilationInstructions:
 *                       type: string
 *                       nullable: true
 *     responses:
 *       200:
 *         description: ACTs atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.put("/update-many", isAuthenticated, new UpdateManyActChatbotsController().handle);

/**
 * @swagger
 * /admin/acts/{id}:
 *   get:
 *     summary: "[Admin] Detalhar ACT"
 *     description: Retorna os dados completos de um ACT, incluindo instruções de IA e configurações de narrativa.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do ACT
 *     responses:
 *       200:
 *         description: Dados do ACT
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
adminActRouter.get("/:id", isAuthenticated, new FindActChatbotController().handle);

/**
 * @swagger
 * /admin/acts/{id}:
 *   put:
 *     summary: "[Admin] Atualizar ACT"
 *     description: >
 *       Atualiza os dados de um ACT. Todos os campos são opcionais.
 *       `messageInstructions` e `compilationInstructions` são prompts de sistema para a IA — alterar esses campos impacta diretamente o comportamento do chatbot e a qualidade das narrativas geradas.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do ACT
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
 *               trailId:
 *                 type: string
 *                 format: cuid
 *               index:
 *                 type: integer
 *                 description: Posição de ordenação (0-based) dentro da trilha
 *               initialMessage:
 *                 type: string
 *                 nullable: true
 *                 description: Primeira mensagem exibida ao usuário ao iniciar o ACT
 *               messageInstructions:
 *                 type: string
 *                 nullable: true
 *                 description: Prompt de sistema para a IA gerar respostas durante a conversa
 *               compilationInstructions:
 *                 type: string
 *                 nullable: true
 *                 description: Prompt de sistema para a IA compilar o capítulo em narrativa final
 *     responses:
 *       200:
 *         description: ACT atualizado com sucesso
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
adminActRouter.put("/:id", isAuthenticated, new UpdateActChatbotController().handle);

/**
 * @swagger
 * /admin/acts:
 *   post:
 *     summary: "[Admin] Criar ACT"
 *     description: >
 *       Cria um novo chatbot narrativo (ACT) e o vincula a uma trilha.
 *       `initialMessage` é a primeira mensagem exibida ao usuário ao iniciar o ACT.
 *       `messageInstructions` é o prompt de sistema que guia a IA durante a conversa.
 *       `compilationInstructions` é o prompt de sistema usado na compilação final do capítulo.
 *     tags: [Admin - ACTs]
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
 *               - trailId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *                 description: Identificador do ícone para exibição na UI
 *               trailId:
 *                 type: string
 *                 format: cuid
 *                 description: ID da trilha à qual este ACT pertence
 *               initialMessage:
 *                 type: string
 *                 description: Primeira mensagem exibida ao usuário ao iniciar o ACT
 *               messageInstructions:
 *                 type: string
 *                 description: Prompt de sistema para guiar a IA durante a conversa
 *               compilationInstructions:
 *                 type: string
 *                 description: Prompt de sistema para guiar a IA na compilação final do capítulo
 *     responses:
 *       200:
 *         description: ACT criado com sucesso
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.post("/", isAuthenticated, new CreateActChatbotController().handle);

/**
 * @swagger
 * /admin/acts/{id}/import-chatbase-chapters:
 *   post:
 *     summary: "[Admin] Importar capítulos do Chatbase"
 *     description: >
 *       Importa capítulos de conversas de um chatbot externo do Chatbase para o ACT indicado.
 *       O `chatbaseChatbotId` é o ID do chatbot na plataforma Chatbase.
 *       Os capítulos importados terão o campo `externalId` preenchido com o ID da conversa no Chatbase.
 *       Retorna os dados estruturados dos usuários e conversas importados.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do ACT destino da importação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatbaseChatbotId
 *             properties:
 *               chatbaseChatbotId:
 *                 type: string
 *                 description: ID do chatbot na plataforma Chatbase
 *     responses:
 *       200:
 *         description: Capítulos importados com sucesso
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
 *                   description: Dados estruturados dos usuários e conversas importados
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminActRouter.post("/:id/import-chatbase-chapters", isAuthenticated, new ImportChatbaseChaptersController().handle);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis:
 *   post:
 *     summary: "[Admin] Gerar análise de ACT da empresa"
 *     description: >
 *       Dispara a análise em lote (batch) dos capítulos de um ACT para todos os colaboradores de uma empresa.
 *       A análise identifica os fatores psicossociais presentes nas mensagens dos capítulos usando a API de batch da OpenAI.
 *       O processamento é assíncrono — o status pode ser acompanhado pelos campos `BatchStatus`.
 *     tags: [Admin - ACTs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actChatbotId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do ACT a analisar
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Análise iniciada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.post("/:actChatbotId/analysis", isAuthenticated, new GenerateActAnalysisController().handle);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis:
 *   get:
 *     summary: "[Admin] Buscar análise de ACT da empresa"
 *     description: >
 *       Retorna os dados da análise de ACT de uma empresa, incluindo o status do batch assíncrono.
 *       `BatchStatus` pode ser: `in_progress`, `completed`, `failed`, `cancelled`, `cancelling`, `validating`, `finalizing`, `expired`.
 *     tags: [Admin - ACTs]
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
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: occupation
 *         schema:
 *           type: string
 *       - in: query
 *         name: occupationLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: skinColor
 *         schema:
 *           type: string
 *       - in: query
 *         name: hasDisability
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual no nome do fator psicossocial
 *       - in: query
 *         name: nationalityId
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Itens paginados da análise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.get("/:actChatbotId/analysis", isAuthenticated, new FindActAnalysisController().handle);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis/summary:
 *   get:
 *     summary: "[Admin] Sumário de scores da análise de ACT"
 *     description: >
 *       Retorna os scores calculados (totalScore, positiveScore, negativeScore, absoluteScore)
 *       e os blocos de automonitoramento com seus fatores, sempre calculados sobre **todos** os
 *       dados filtrados, independente de paginação.
 *     tags: [Admin - ACTs]
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
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: occupation
 *         schema:
 *           type: string
 *       - in: query
 *         name: occupationLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: skinColor
 *         schema:
 *           type: string
 *       - in: query
 *         name: hasDisability
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual no nome do fator psicossocial
 *       - in: query
 *         name: nationalityId
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Scores consolidados da análise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.get("/:actChatbotId/analysis/summary", isAuthenticated, new FindActAnalysisSummaryController().handle);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis/report:
 *   get:
 *     summary: "[Admin] Obter relatório de análise de ACT"
 *     description: >
 *       Retorna o relatório consolidado da análise de ACT de uma empresa, incluindo os fatores psicossociais identificados e sua frequência.
 *       O relatório só está disponível após a análise (`BatchStatus: completed`) ser concluída.
 *     tags: [Admin - ACTs]
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
 *         description: Relatório de análise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.get("/:actChatbotId/analysis/report", isAuthenticated, new GenerateAnalysisReportController().handle);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis/factors/{factorId}/messages:
 *   get:
 *     summary: "[Admin] Listar mensagens de um fator psicossocial na análise"
 *     description: >
 *       Retorna as mensagens dos capítulos que foram identificadas como relacionadas a um fator psicossocial específico.
 *       Útil para visualizar as evidências textuais que embasaram a identificação do fator.
 *     tags: [Admin - ACTs]
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
 *       - in: path
 *         name: factorId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do fator psicossocial
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Mensagens associadas ao fator
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
 *                     $ref: '#/components/schemas/ActChapterMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminActRouter.get(
  "/:actChatbotId/analysis/factors/:factorId/messages",
  isAuthenticated,
  new FindActAnalysisFactorMessagesController().handle,
);

export { adminActRouter };
