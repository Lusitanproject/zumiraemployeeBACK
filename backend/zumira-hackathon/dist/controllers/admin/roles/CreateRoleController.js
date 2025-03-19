"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleController = exports.CreateRoleSchema = void 0;
const zod_1 = require("zod");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
exports.CreateRoleSchema = zod_1.z.object({
    slug: zod_1.z.string()
});
class CreateRoleController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-roles");
        const { success, data, error } = exports.CreateRoleSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error)
            });
        }
        const { slug } = data;
        const roleService = new RoleAdminService_1.RoleAdminService();
        const roleExists = await roleService.findBySlug(slug);
        if (roleExists) {
            return res.status(400).json({
                status: "ERROR",
                message: "Já existe um perfil com o valor informado"
            });
        }
        const role = await roleService.create(slug);
        return res.json({ status: "SUCCESS", data: role });
    }
}
exports.CreateRoleController = CreateRoleController;
