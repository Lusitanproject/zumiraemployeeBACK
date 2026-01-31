"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllUsersController = void 0;
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
class ListAllUsersController {
    async handle(req, res) {
        const userService = new UserAdminService_1.UserAdminService();
        const users = await userService.findAll();
        return res.json({ status: "SUCCESS", data: { users } });
    }
}
exports.ListAllUsersController = ListAllUsersController;
