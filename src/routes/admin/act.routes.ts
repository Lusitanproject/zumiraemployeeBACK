import { Router } from "express";

import { GenerateActAnalysisController } from "../../controllers/admin/acts/analysis/GenerateActAnalysisController";
import { RegenerateAnalysisReportController } from "../../controllers/admin/acts/analysis/RegenerateAnalysisReportController";
import { UpdateAnalysisReportController } from "../../controllers/admin/acts/analysis/UpdateAnalysisReportController";
import { CreateActChatbotController } from "../../controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "../../controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "../../controllers/admin/acts/FindAllActChatbotsController";
import { FindByTrailController } from "../../controllers/admin/acts/FindByTrailController";
import { ImportChatbaseChaptersController } from "../../controllers/admin/acts/ImportChatbaseChaptersController";
import { OverrideFactorAssociationsController } from "../../controllers/admin/acts/OverrideFactorAssociationsController";
import { TestMessageActChatbotController } from "../../controllers/admin/acts/TestMessageActChatbotController";
import { UpdateActChatbotController } from "../../controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "../../controllers/admin/acts/UpdateManyActChatbotsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { requirePermissions } from "../../middlewares/requirePermissions";

const adminActRouter = Router();

/**
 * @swagger
 * /admin/acts:
 *   get:
 *     summary: "[Admin] Listar todos os ACTs"
 *     description: "Retorna todos os chatbots narrativos (ACTs) cadastrados no sistema, independente de trilha ou empresa. Requer permissão `manage-acts`."
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.get(
  "/",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new FindAllActChatbotsController().handle,
);

/**
 * @swagger
 * /admin/acts/by-trail:
 *   get:
 *     summary: "[Admin] Listar ACTs de uma trilha"
 *     description: "Retorna os ACTs pertencentes a uma trilha específica, ordenados por `index`. Requer permissão `manage-acts`."
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.get(
  "/by-trail",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new FindByTrailController().handle,
);

/**
 * @swagger
 * /admin/acts/update-many:
 *   put:
 *     summary: "[Admin] Atualizar múltiplos ACTs em lote"
 *     description: >
 *       Atualiza vários ACTs de uma vez. Útil para reordenar ACTs dentro de uma trilha (alterar o campo `index` de vários ao mesmo tempo).
 *       Requer permissão `manage-acts`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.put(
  "/update-many",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new UpdateManyActChatbotsController().handle,
);

/**
 * @swagger
 * /admin/acts/analysis/factor-associations:
 *   put:
 *     summary: "[Admin] Corrigir associações de fatores psicossociais"
 *     description: >
 *       Recebe uma lista de pares `(associationId, newFactorId)`. Para cada par, cria uma nova associação
 *       com `author = HUMAN` e o novo fator, e marca a associação original como `effective = false`.
 *       Requer permissão `manage-acts`.
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
 *               - overrides
 *             properties:
 *               overrides:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - associationId
 *                     - newFactorId
 *                   properties:
 *                     associationId:
 *                       type: string
 *                       format: cuid
 *                       description: ID da associação mensagem × fator a ser substituída
 *                     newFactorId:
 *                       type: string
 *                       format: cuid
 *                       description: ID do novo fator psicossocial correto
 *     responses:
 *       200:
 *         description: Associações corrigidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.put(
  "/analysis/factor-associations",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new OverrideFactorAssociationsController().handle,
);

/**
 * @swagger
 * /admin/acts/{id}:
 *   get:
 *     summary: "[Admin] Detalhar ACT"
 *     description: "Retorna os dados completos de um ACT, incluindo todos os campos de instrução de IA. Requer permissão `manage-acts`."
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
 *         description: Dados completos do ACT
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
adminActRouter.get(
  "/:id",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new FindActChatbotController().handle,
);

/**
 * @swagger
 * /admin/acts/{id}:
 *   put:
 *     summary: "[Admin] Atualizar ACT"
 *     description: >
 *       Atualiza os dados de um ACT. Todos os campos são opcionais.
 *       `messageInstructions` e `compilationInstructions` são prompts de sistema para a IA — alterar esses campos impacta diretamente o comportamento do chatbot e a qualidade das narrativas geradas.
 *       Requer permissão `manage-acts`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminActRouter.put(
  "/:id",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new UpdateActChatbotController().handle,
);

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
 *       Requer permissão `manage-acts`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.post(
  "/",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new CreateActChatbotController().handle,
);

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
 *       Requer permissão `manage-acts`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminActRouter.post(
  "/:id/import-chatbase-chapters",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new ImportChatbaseChaptersController().handle,
);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis:
 *   post:
 *     summary: "[Admin] Gerar análise de ACT da empresa"
 *     description: >
 *       Dispara a análise em lote (batch) dos capítulos de um ACT para todos os colaboradores de uma empresa.
 *       A análise identifica os fatores psicossociais presentes nas mensagens dos capítulos usando a API de batch da OpenAI.
 *       O processamento é assíncrono — o status pode ser acompanhado pelos campos `BatchStatus`.
 *       Requer permissão `manage-acts`.
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.post(
  "/:actChatbotId/analysis",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new GenerateActAnalysisController().handle,
);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis/report:
 *   put:
 *     summary: "[Admin] Atualizar dados do laudo de análise ACT"
 *     description: >
 *       Atualiza os metadados editáveis do laudo mais recente de um ACT para uma empresa.
 *       Todos os campos são opcionais — campos ausentes no body não são alterados.
 *       Campos anuláveis (como `issuedAt`) podem ser explicitamente zerados passando `null`.
 *       Não aciona regeneração por IA. Requer permissão `acts-manage-analysis`.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               evaluationPeriod:
 *                 type: string
 *                 nullable: true
 *               evaluationType:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Texto qualitativo do laudo (sobrescreve o gerado por IA)
 *               totalParticipants:
 *                 type: integer
 *                 minimum: 0
 *               technicalResponsible:
 *                 type: string
 *                 nullable: true
 *               professionalRegistration:
 *                 type: string
 *                 nullable: true
 *               issuedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Laudo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/AnalysisReport'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.put(
  "/:actChatbotId/analysis/report",
  isAuthenticated,
  requirePermissions("acts-manage-analysis"),
  new UpdateAnalysisReportController().handle,
);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/analysis/report:
 *   post:
 *     summary: "[Admin] Regerar laudo qualitativo de análise ACT"
 *     description: >
 *       Força a regeração do laudo qualitativo (texto gerado por IA) para a análise mais recente de um ACT.
 *       Reseta o status do laudo para `PENDING` e dispara a geração de forma **síncrona**, retornando o
 *       laudo pronto na resposta. Útil quando as instruções de geração foram alteradas ou o resultado
 *       anterior não foi satisfatório. Requer que todos os batches da análise estejam concluídos.
 *       Requer permissão `acts-manage-analysis`.
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
 *         description: Laudo regerado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateAnalysisReportResult'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminActRouter.post(
  "/:actChatbotId/analysis/report",
  isAuthenticated,
  requirePermissions("acts-manage-analysis"),
  new RegenerateAnalysisReportController().handle,
);

/**
 * @swagger
 * /admin/acts/{actChatbotId}/test-message:
 *   post:
 *     summary: "[Admin] Testar mensagem com Act Chatbot sem criar chapter"
 *     description: >
 *       Envia um histórico de mensagens para o chatbot do ACT e retorna a próxima resposta da IA,
 *       sem persistir nenhuma informação no banco. Útil para testar as instruções configuradas no ACT.
 *       Requer permissão `admin-acts-manage`.
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
 *         description: ID do ACT a testar
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
 *                   required: [role, content]
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Resposta gerada pelo chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   type: string
 *                   example: "Olá! Como posso te ajudar?"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminActRouter.post(
  "/:actChatbotId/test-message",
  isAuthenticated,
  requirePermissions("admin-acts-manage"),
  new TestMessageActChatbotController().handle,
);

export { adminActRouter };
