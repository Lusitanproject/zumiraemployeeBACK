"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserController = void 0;
const zod_1 = require("zod");
const UserService_1 = require("../../services/user/UserService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParam = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
class FindUserController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(error) });
        }
        const userService = new UserService_1.UserService();
        const user = await userService.find(data.userId);
        if (!user) {
            return res.status(400).json({ status: "ERROR", message: "Usuário não encontrado." });
        }
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.FindUserController = FindUserController;
