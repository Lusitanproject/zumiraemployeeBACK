"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRoleController = void 0;
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
const error_1 = require("../../../error");
class FindRoleController {
    async handle(req, res) {
        const { id } = req.params;
        const roleService = new RoleAdminService_1.RoleAdminService();
        const role = await roleService.find(id);
        if (!role)
            throw new error_1.PublicError("Perfil não encontrado");
        return res.json({ status: "SUCCESS", data: role });
    }
}
exports.FindRoleController = FindRoleController;
