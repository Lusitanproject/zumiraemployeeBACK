"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPermissionRouter = void 0;
const express_1 = require("express");
const FindAllPermissionsController_1 = require("../../controllers/admin/permissions/FindAllPermissionsController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminPermissionRouter = (0, express_1.Router)();
exports.adminPermissionRouter = adminPermissionRouter;
/**
 * @swagger
 * /admin/permissions:
 *   get:
 *     summary: "[Admin] Listar permissões disponíveis"
 *     description: >
 *       Retorna todas as permissões cadastradas no sistema.
 *       Permissões são strings que controlam o acesso a funcionalidades específicas (ex: "manage-users", "read-assessment").
 *       Use este endpoint para popular seletores ao configurar permissões de papéis via `PUT /admin/roles/:id/permissions`.
 *     tags: [Admin - Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permissões disponíveis
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
 *                     type: string
 *                   example: ["manage-users", "manage-roles", "read-assessment", "answer-assessment", "manage-company"]
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
adminPermissionRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllPermissionsController_1.FindAllPermissionsController().handle);
