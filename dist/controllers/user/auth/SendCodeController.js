"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeController = void 0;
const zod_1 = require("zod");
const AuthService_1 = require("../../../services/user/AuthService");
const parseZodError_1 = require("../../../utils/parseZodError");
const CreateCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
class SendCodeController {
    async handle(req, res) {
        const { success, data, error } = CreateCodeSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { email } = data;
        const sendCode = new AuthService_1.AuthService();
        const response = await sendCode.sendCode(email);
        return res.json({ status: "SUCCESS", data: response });
    }
}
exports.SendCodeController = SendCodeController;
