import { Router } from "express";

import { GetFullStoryController } from "../controllers/trail/GetFullStoryController";
import { GetTrailActsController } from "../controllers/trail/GetTrailActsController";
import { MoveToNextActController } from "../controllers/trail/MoveToNextActController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { requirePermissions } from "../middlewares/requirePermissions";

const trailRouter = Router();

/**
 * @swagger
 * /trails/{trailId}/acts:
 *   get:
 *     summary: Listar atos da trilha do usuário com progresso
 *     description: >
 *       Retorna os atos da trilha informada, com `index`, `locked` e `current`.
 *       Se ainda não houver progresso registrado para o usuário nesta trilha, cria lazily apontando para o primeiro ato.
 *       Use `GET /companies/trail` para obter o `trailId` da empresa do usuário.
 *       Requer permissão `acts-engage`.
 *     tags: [Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha (obtido via GET /companies/trail)
 *     responses:
 *       200:
 *         description: Lista de atos com progresso do usuário
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
 *                     chatbots:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActChatbot'
 *                     chapters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActChapter'
 *                     progress:
 *                       type: number
 *                       format: float
 *                       description: Progresso de 0 a 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
trailRouter.get(
  "/:trailId/acts",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new GetTrailActsController().handle,
);

/**
 * @swagger
 * /trails/{trailId}/full-story:
 *   get:
 *     summary: Obter história completa compilada do usuário
 *     description: >
 *       Retorna a narrativa completa — compilação de todos os capítulos concluídos do usuário na trilha informada.
 *       Requer permissão `acts-engage`.
 *     tags: [Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha (obtido via GET /companies/trail)
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
trailRouter.get(
  "/:trailId/full-story",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new GetFullStoryController().handle,
);

/**
 * @swagger
 * /trails/{trailId}/next:
 *   put:
 *     summary: Avançar para o próximo ato da trilha
 *     description: >
 *       Avança o progresso do usuário para o próximo ato da trilha informada.
 *       Requer que o usuário tenha iniciado o ato atual (ao menos 1 mensagem).
 *       Se já estiver no último ato, permanece no mesmo.
 *       Requer permissão `acts-engage`.
 *     tags: [Trails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID da trilha (obtido via GET /companies/trail)
 *     responses:
 *       200:
 *         description: ID do ato atual após o avanço
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
 *                     currActChatbotId:
 *                       type: string
 *                       format: cuid
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
trailRouter.put(
  "/:trailId/next",
  isAuthenticated,
  requirePermissions("acts-engage"),
  new MoveToNextActController().handle,
);

export { trailRouter };
