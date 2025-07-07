"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const users_1 = require("../../../definitions/admin/users");
const error_1 = require("../../../error");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const RoleAdminService_1 = require("../../../services/admin/RoleAdminService");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateUserController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { success, data, error } = users_1.CreateUserSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { name, email, roleId, companyId } = data;
        const roleService = new RoleAdminService_1.RoleAdminService();
        const role = await roleService.find(roleId);
        if (!role)
            throw new error_1.PublicError("O perfil de usuário informado é inválido");
        if (role.slug === "admin" && req.user.role !== "admin") {
            throw new error_1.PublicError("O usuário não tem permissão para realizar essa operação.");
        }
        if (companyId) {
            const companyService = new CompanyAdminService_1.CompanyAdminService();
            const company = await companyService.find(companyId);
            if (!company)
                throw new error_1.PublicError("A empresa informada não é válida");
        }
        const userService = new UserAdminService_1.UserAdminService();
        const emailExists = await userService.findByEmail(email);
        if (emailExists)
            throw new error_1.PublicError("Já exista uma conta em uso com o email informado");
        const user = await userService.create({ name, email, roleId, companyId });
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.CreateUserController = CreateUserController;
