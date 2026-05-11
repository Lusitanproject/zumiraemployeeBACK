"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPsychosocialFactorRouter = void 0;
const express_1 = require("express");
const CreatePsychosocialFactorController_1 = require("../../controllers/admin/psychosocial-factors/CreatePsychosocialFactorController");
const DeletePsychosocialFactorController_1 = require("../../controllers/admin/psychosocial-factors/DeletePsychosocialFactorController");
const FindAllPsychosocialFactorsController_1 = require("../../controllers/admin/psychosocial-factors/FindAllPsychosocialFactorsController");
const FindPsychosocialFactorController_1 = require("../../controllers/admin/psychosocial-factors/FindPsychosocialFactorController");
const UpdatePsychosocialFactorController_1 = require("../../controllers/admin/psychosocial-factors/UpdatePsychosocialFactorController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminPsychosocialFactorRouter = (0, express_1.Router)();
exports.adminPsychosocialFactorRouter = adminPsychosocialFactorRouter;
/**
 * @swagger
 * /admin/psychosocial-factors:
 *   get:
 *     summary: "[Admin] Listar fatores psicossociais"
 *     description: >
 *       Retorna todos os fatores de risco psicossocial cadastrados.
 *       Fatores psicossociais são temáticas identificadas nas análises de ACT (ex: 'Sobrecarga de trabalho', 'Falta de reconhecimento').
 *       Cada fator possui um `wheight` (peso) que indica sua relevância relativa na análise.
 *     tags: [Admin - Psychosocial Factors]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PsychosocialFactor'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminPsychosocialFactorRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllPsychosocialFactorsController_1.FindAllPsychosocialFactorsController().handle);
/**
 * @swagger
 * /admin/psychosocial-factors:
 *   post:
 *     summary: "[Admin] Criar fator psicossocial"
 *     description: >
 *       Cria um novo fator de risco psicossocial.
 *       O campo `wheight` (peso, com typo no schema original) define a relevância do fator nas análises de ACT.
 *       Fatores com maior peso têm mais influência na interpretação dos resultados.
 *     tags: [Admin - Psychosocial Factors]
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
 *               - wheight
 *               - description
 *               - selfMonitoringBlockId
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               wheight:
 *                 type: integer
 *                 description: Peso/relevância do fator nas análises (campo nomeado 'wheight' — typo no schema do banco, não alterar)
 *                 example: 3
 *               description:
 *                 type: string
 *               selfMonitoringBlockId:
 *                 type: string
 *                 description: ID do bloco de automonitoramento ao qual o fator pertence
 *     responses:
 *       200:
 *         description: Fator criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychosocialFactor'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminPsychosocialFactorRouter.post("/", isAuthenticated_1.isAuthenticated, new CreatePsychosocialFactorController_1.CreatePsychosocialFactorController().handle);
/**
 * @swagger
 * /admin/psychosocial-factors/{id}:
 *   get:
 *     summary: "[Admin] Detalhar fator psicossocial"
 *     description: Retorna os dados de um fator psicossocial específico.
 *     tags: [Admin - Psychosocial Factors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do fator psicossocial
 *     responses:
 *       200:
 *         description: Dados do fator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychosocialFactor'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminPsychosocialFactorRouter.get("/:id", isAuthenticated_1.isAuthenticated, new FindPsychosocialFactorController_1.FindPsychosocialFactorController().handle);
/**
 * @swagger
 * /admin/psychosocial-factors/{id}:
 *   put:
 *     summary: "[Admin] Atualizar fator psicossocial"
 *     description: Atualiza os dados de um fator psicossocial existente.
 *     tags: [Admin - Psychosocial Factors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do fator psicossocial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - wheight
 *               - description
 *               - selfMonitoringBlockId
 *             properties:
 *               name:
 *                 type: string
 *               wheight:
 *                 type: integer
 *               description:
 *                 type: string
 *               selfMonitoringBlockId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fator atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 data:
 *                   $ref: '#/components/schemas/PsychosocialFactor'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminPsychosocialFactorRouter.put("/:id", isAuthenticated_1.isAuthenticated, new UpdatePsychosocialFactorController_1.UpdatePsychosocialFactorController().handle);
/**
 * @swagger
 * /admin/psychosocial-factors/{id}:
 *   delete:
 *     summary: "[Admin] Excluir fator psicossocial"
 *     description: Remove permanentemente um fator psicossocial. Ação irreversível.
 *     tags: [Admin - Psychosocial Factors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: ID do fator a excluir
 *     responses:
 *       200:
 *         description: Fator excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminPsychosocialFactorRouter.delete("/:id", isAuthenticated_1.isAuthenticated, new DeletePsychosocialFactorController_1.DeletePsychosocialFactorController().handle);
