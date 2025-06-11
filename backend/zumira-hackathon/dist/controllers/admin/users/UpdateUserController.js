"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const zod_1 = require("zod");
const users_1 = require("../../../definitions/admin/users");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
class UpdateUserController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { id } = RequestParams.parse(req.params);
        const { success, data, error } = users_1.UpdateUserSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const { name, roleId, companyId } = data;
        if (roleId) {
            const roleService = new RoleAdminService_1.RoleAdminService();
            const role = await roleService.find(roleId);
            if (!role) {
                return res.status(400).json({
                    status: "ERROR",
                    message: "O perfil de usuário informado é inválido",
                });
            }
            if (role.slug === "admin" && req.user.role !== "admin") {
                return res.status(400).json({
                    status: "ERROR",
                    message: "O usuário não tem permissão para realizar essa operação.",
                });
            }
        }
        if (companyId) {
            const companyService = new CompanyAdminService_1.CompanyAdminService();
            const company = await companyService.find(companyId);
            if (!company) {
                return res.status(400).json({
                    status: "ERROR",
                    message: "A empresa informada não é válida",
                });
            }
        }
        const userService = new UserAdminService_1.UserAdminService();
        const user = await userService.update({ id, name, roleId, companyId });
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.UpdateUserController = UpdateUserController;
