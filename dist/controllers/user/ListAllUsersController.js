"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllUsersController = void 0;
const UserService_1 = require("../../services/user/UserService");
class ListAllUsersController {
    async handle(req, res) {
        const userService = new UserService_1.UserService();
        const users = await userService.findAll();
        return res.json({ status: "SUCCESS", data: { users } });
    }
}
exports.ListAllUsersController = ListAllUsersController;
