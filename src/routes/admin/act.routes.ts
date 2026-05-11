import { Router } from "express";

import { CreateActChatbotController } from "../../controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "../../controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "../../controllers/admin/acts/FindAllActChatbotsController";
import { FindByCompanyController } from "../../controllers/admin/acts/FindByCompanyController";
import { FindByTrailController } from "../../controllers/admin/acts/FindByTrailController";
import { ImportChatbaseChaptersController } from "../../controllers/admin/acts/ImportChatbaseChaptersController";
import { UpdateActChatbotController } from "../../controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "../../controllers/admin/acts/UpdateManyActChatbotsController";
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

export { adminActRouter };
