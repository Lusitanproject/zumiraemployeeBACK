"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateManyUsersController = void 0;
const users_1 = require("../../../definitions/admin/users");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateManyUsersController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { success, data, error } = users_1.CreateManyUsersSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userService = new UserAdminService_1.UserAdminService();
        const result = await userService.createMany(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateManyUsersController = CreateManyUsersController;
