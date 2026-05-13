"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserByController = void 0;
const users_1 = require("../../schemas/admin/users");
const UserService_1 = require("../../services/user/UserService");
const parseZodError_1 = require("../../utils/parseZodError");
class FindUserByController {
    async handle(req, res) {
        const { success, data, error } = users_1.FindUserBySchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new UserService_1.UserService();
        const result = await service.findBy(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindUserByController = FindUserByController;
