"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserFiltersController = void 0;
const users_1 = require("../../../schemas/admin/users");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
class GetUserFiltersController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { success, data, error } = users_1.GetUserFiltersSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(error) });
        }
        const userService = new UserAdminService_1.UserAdminService();
        const filters = await userService.getFilters(data.columns);
        return res.json({ status: "SUCCESS", data: filters });
    }
}
exports.GetUserFiltersController = GetUserFiltersController;
