import { Router } from "express";

import { ListNationalitiesController } from "../controllers/nationality/ListNationalitiesController";

const nationalityRouter = Router();

/**
 * @swagger
 * /nationalities:
 *   get:
 *     summary: Listar nacionalidades
 *     description: >
 *       Retorna todas as nacionalidades cadastradas no sistema.
 *       Endpoint público — não requer autenticação.
 *       Usado no cadastro de usuários para selecionar a nacionalidade e determinar quais avaliações localizadas serão exibidas.
 *     tags: [Nationalities]
 *     responses:
 *       200:
 *         description: Lista de nacionalidades
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
 *                     $ref: '#/components/schemas/Nationality'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
nationalityRouter.get("/", new ListNationalitiesController().handle);

export { nationalityRouter };
