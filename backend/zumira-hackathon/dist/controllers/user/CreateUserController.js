"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const parseZodError_1 = require("../../utils/parseZodError");
const CreateUserService_1 = require("../../services/user/CreateUserService");
const user_1 = require("../../definitions/user");
class CreateUserController {
    async handle(req, res) {
        const { success, data, error } = user_1.CreateUserSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const createUser = new CreateUserService_1.CreateUserService();
        const user = await createUser.execute(data);
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.CreateUserController = CreateUserController;
