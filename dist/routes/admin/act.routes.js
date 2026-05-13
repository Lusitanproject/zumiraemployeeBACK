"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminActRouter = void 0;
const express_1 = require("express");
const CreateActChatbotController_1 = require("../../controllers/admin/acts/CreateActChatbotController");
const FindAllActChatbotsController_1 = require("../../controllers/admin/acts/FindAllActChatbotsController");
const FindByTrailController_1 = require("../../controllers/admin/acts/FindByTrailController");
const ImportChatbaseChaptersController_1 = require("../../controllers/admin/acts/ImportChatbaseChaptersController");
const UpdateActChatbotController_1 = require("../../controllers/admin/acts/UpdateActChatbotController");
const UpdateManyActChatbotsController_1 = require("../../controllers/admin/acts/UpdateManyActChatbotsController");
const GenerateActAnalysisController_1 = require("../../controllers/admin/acts/analysis/GenerateActAnalysisController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminActRouter = (0, express_1.Router)();
exports.adminActRouter = adminActRouter;
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
adminActRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllActChatbotsController_1.FindAllActChatbotsController().handle);
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
adminActRouter.get("/by-trail", isAuthenticated_1.isAuthenticated, new FindByTrailController_1.FindByTrailController().handle);
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
adminActRouter.put("/update-many", isAuthenticated_1.isAuthenticated, new UpdateManyActChatbotsController_1.UpdateManyActChatbotsController().handle);
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
adminActRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdateActChatbotController_1.UpdateActChatbotController().handle);
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
adminActRouter.post("/", isAuthenticated_1.isAuthenticated, new CreateActChatbotController_1.CreateActChatbotController().handle);
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
adminActRouter.post("/:id/import-chatbase-chapters", isAuthenticated_1.isAuthenticated, new ImportChatbaseChaptersController_1.ImportChatbaseChaptersController().handle);
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
adminActRouter.post("/:actChatbotId/analysis", isAuthenticated_1.isAuthenticated, new GenerateActAnalysisController_1.GenerateActAnalysisController().handle);
