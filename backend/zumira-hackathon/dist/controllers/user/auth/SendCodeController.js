"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeController = void 0;
const SendCodeService_1 = require("../../../services/user/auth/SendCodeService");
const zod_1 = require("zod");
const CreateCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
class SendCodeController {
    async handle(req, res) {
        const { success, data } = CreateCodeSchema.safeParse(req.body);
        try {
            if (!success) {
                return res.status(400).json({
                    status: "ERROR",
                    message: "Email inválido",
                });
            }
            const { email } = data;
            const sendCode = new SendCodeService_1.SendCodeService();
            const response = await sendCode.execute(email);
            return res.json({ status: "SUCCESS", data: response });
        }
        catch {
            return res.status(500).json({
                status: "ERROR",
                message: "Erro interno",
            });
        }
    }
}
exports.SendCodeController = SendCodeController;
