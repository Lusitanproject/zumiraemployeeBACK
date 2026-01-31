"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersByCompanyController = void 0;
const zod_1 = require("zod");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
const FindByCompanySchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
});
class ListUsersByCompanyController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { success, data, error } = FindByCompanySchema.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const { companyId } = data;
        const userService = new UserAdminService_1.UserAdminService();
        const users = await userService.findByCompany(companyId);
        return res.json({ status: "SUCCESS", data: { users } });
    }
}
exports.ListUsersByCompanyController = ListUsersByCompanyController;
