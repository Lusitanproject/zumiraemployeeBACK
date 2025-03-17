"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeController = void 0;
const SendCodeService_1 = require("../../../services/user/auth/SendCodeService");
const zod_1 = require("zod");
const CreateCodeSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
class SendCodeController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { success, data, error } = CreateCodeSchema.safeParse(req.body);
            try {
                if (!success) {
                    return res.status(400).json({
                        status: "ERROR",
                        message: "Email inválido"
                    });
                }
                const { email } = data;
                const sendCode = new SendCodeService_1.SendCodeService();
                const response = yield sendCode.execute(email);
                return res.json({ status: "SUCCESS", data: response });
            }
            catch (_a) {
                return res.status(500).json({
                    status: "ERROR",
                    message: "Erro interno"
                });
            }
        });
    }
}
exports.SendCodeController = SendCodeController;
