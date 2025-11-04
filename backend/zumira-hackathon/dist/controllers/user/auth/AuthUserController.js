"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserController = void 0;
const AuthUserService_1 = require("../../../services/user/auth/AuthUserService");
const parseZodError_1 = require("../../../utils/parseZodError");
const user_1 = require("../../../definitions/user");
class AuthUserController {
    async handle(req, res) {
        const { success, data, error } = user_1.AuthUserSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const authUser = new AuthUserService_1.AuthUserService();
        const auth = await authUser.execute(data);
        return res.json({ status: "SUCCESS", data: auth });
    }
}
exports.AuthUserController = AuthUserController;
