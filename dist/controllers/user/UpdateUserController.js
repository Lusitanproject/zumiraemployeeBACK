"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const zod_1 = require("zod");
const users_1 = require("../../schemas/admin/users");
const CompanyService_1 = require("../../services/company/CompanyService");
const RoleAdminService_1 = require("../../services/admin/RoleAdminService");
const UserService_1 = require("../../services/user/UserService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
class UpdateUserController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { id } = RequestParams.parse(req.params);
        const { success, data, error } = users_1.UpdateUserSchema.safeParse(req.body);
        if (!success) {
            throw new Error((0, parseZodError_1.parseZodError)(error));
        }
        const { roleId, companyId } = data;
        if (roleId) {
            const roleService = new RoleAdminService_1.RoleAdminService();
            const role = await roleService.find(roleId);
            if (!role) {
                return res.status(400).json({ status: "ERROR", message: "O perfil de usuário informado é inválido" });
            }
            if (role.slug === "admin" && req.user.role !== "admin") {
                return res.status(400).json({
                    status: "ERROR",
                    message: "O usuário não tem permissão para realizar essa operação.",
                });
            }
        }
        if (companyId) {
            const companyService = new CompanyService_1.CompanyService();
            const company = await companyService.find(companyId);
            if (!company) {
                return res.status(400).json({ status: "ERROR", message: "A empresa informada não é válida" });
            }
        }
        const userService = new UserService_1.UserService();
        const user = await userService.update({ id, ...data });
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.UpdateUserController = UpdateUserController;
