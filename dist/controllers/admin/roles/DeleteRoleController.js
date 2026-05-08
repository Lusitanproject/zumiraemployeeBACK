"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoleController = void 0;
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
class DeleteRoleController {
    async handle(req, res) {
        const { id } = req.params;
        const roleService = new RoleAdminService_1.RoleAdminService();
        await roleService.delete(id);
        return res.json({ status: "SUCCESS" });
    }
}
exports.DeleteRoleController = DeleteRoleController;
