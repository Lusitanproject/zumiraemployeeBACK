"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPermissionRouter = void 0;
const express_1 = require("express");
const FindAllPermissionsController_1 = require("../../controllers/admin/permissions/FindAllPermissionsController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const adminPermissionRouter = (0, express_1.Router)();
exports.adminPermissionRouter = adminPermissionRouter;
adminPermissionRouter.get("/", isAuthenticated_1.isAuthenticated, new FindAllPermissionsController_1.FindAllPermissionsController().handle);
