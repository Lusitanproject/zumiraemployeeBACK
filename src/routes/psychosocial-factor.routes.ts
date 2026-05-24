import { Router } from "express";

import { ListPsychosocialFactorsController } from "../controllers/psychosocial-factor/ListPsychosocialFactorsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const psychosocialFactorRouter = Router();

/**
 * @swagger
 * /psychosocial-factors:
 *   get:
 *     summary: Listar fatores psicossociais
 *     description: >
 *       Retorna todos os fatores de risco psicossocial cadastrados.
 *       Usados para exibir os fatores identificados nas análises de ACT do usuário.
 *     tags: [Psychosocial Factors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fatores psicossociais
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PsychosocialFactor'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
psychosocialFactorRouter.get("/", isAuthenticated, new ListPsychosocialFactorsController().handle);

export { psychosocialFactorRouter };
