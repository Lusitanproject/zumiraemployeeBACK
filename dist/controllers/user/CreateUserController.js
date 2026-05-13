"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const user_1 = require("../../schemas/user");
const UserService_1 = require("../../services/user/UserService");
const parseZodError_1 = require("../../utils/parseZodError");
class CreateUserController {
    async handle(req, res) {
        const { success, data, error } = user_1.CreateUserSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const createUser = new UserService_1.UserService();
        const user = await createUser.create(data);
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.CreateUserController = CreateUserController;
