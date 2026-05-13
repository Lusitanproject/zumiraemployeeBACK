"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.psychosocialFactorRouter = void 0;
const express_1 = require("express");
const ListPsychosocialFactorsController_1 = require("../controllers/psychosocial-factor/ListPsychosocialFactorsController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const psychosocialFactorRouter = (0, express_1.Router)();
exports.psychosocialFactorRouter = psychosocialFactorRouter;
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
psychosocialFactorRouter.get("/", isAuthenticated_1.isAuthenticated, new ListPsychosocialFactorsController_1.ListPsychosocialFactorsController().handle);
