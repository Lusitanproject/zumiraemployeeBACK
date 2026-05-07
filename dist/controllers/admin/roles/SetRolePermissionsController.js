"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRolePermissionsController = void 0;
const zod_1 = require("zod");
const permissions_1 = require("../../../permissions");
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const error_1 = require("../../../error");
const SetRolePermissionsSchema = zod_1.z.object({
    permissions: zod_1.z.array(zod_1.z.string()),
});
class SetRolePermissionsController {
    async handle(req, res) {
        const { success, data, error } = SetRolePermissionsSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(error) });
        }
        const invalid = data.permissions.filter((p) => !permissions_1.ALL_PERMISSIONS.includes(p));
        if (invalid.length > 0) {
            return res.status(400).json({
                status: "ERROR",
                message: `Permissões inválidas: ${invalid.join(", ")}`,
            });
        }
        const { id: roleId } = req.params;
        const roleService = new RoleAdminService_1.RoleAdminService();
        const role = await roleService.find(roleId);
        if (!role)
            throw new error_1.PublicError("Perfil não encontrado");
        await roleService.setPermissions(roleId, data.permissions);
        return res.json({ status: "SUCCESS" });
    }
}
exports.SetRolePermissionsController = SetRolePermissionsController;
