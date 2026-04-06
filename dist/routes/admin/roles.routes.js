"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRolesRoutes = void 0;
const express_1 = require("express");
const FindAllRolesController_1 = require("../../controllers/admin/roles/FindAllRolesController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminRolesRoutes = (0, express_1.Router)();
exports.adminRolesRoutes = adminRolesRoutes;
adminRolesRoutes.get("/", isAuthenticated_1.isAuthenticated, new FindAllRolesController_1.FindAllRolesController().handle);
