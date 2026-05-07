"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllRolesController = void 0;
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
class FindAllRolesController {
    async handle(req, res) {
        const roleAdminService = new RoleAdminService_1.RoleAdminService();
        const roles = await roleAdminService.findAll();
        return res.json({ status: "SUCCESS", data: { roles } });
    }
}
exports.FindAllRolesController = FindAllRolesController;
