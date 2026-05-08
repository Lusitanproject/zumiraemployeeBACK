"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleController = void 0;
const zod_1 = require("zod");
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const UpdateRoleSchema = zod_1.z.object({
    slug: zod_1.z.string().nonempty(),
});
class UpdateRoleController {
    async handle(req, res) {
        const { success, data, error } = UpdateRoleSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(error) });
        }
        const { id } = req.params;
        const roleService = new RoleAdminService_1.RoleAdminService();
        const slugInUse = await roleService.findBySlug(data.slug);
        if (slugInUse && slugInUse.id !== id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Já existe um perfil com o valor informado",
            });
        }
        const role = await roleService.update({ id, slug: data.slug });
        return res.json({ status: "SUCCESS", data: role });
    }
}
exports.UpdateRoleController = UpdateRoleController;
