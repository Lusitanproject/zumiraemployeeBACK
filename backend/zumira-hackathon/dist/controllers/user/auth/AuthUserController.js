"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserController = void 0;
const zod_1 = require("zod");
const AuthUserService_1 = require("../../../services/user/auth/AuthUserService");
const parseZodError_1 = require("../../../utils/parseZodError");
const CreateAuthSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().length(6),
});
class AuthUserController {
    async handle(req, res) {
        const { success, data, error } = CreateAuthSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { email, code } = data;
        const authUser = new AuthUserService_1.AuthUserService();
        const auth = await authUser.execute({ email, code });
        return res.json({ status: "SUCCESS", data: auth });
    }
}
exports.AuthUserController = AuthUserController;
