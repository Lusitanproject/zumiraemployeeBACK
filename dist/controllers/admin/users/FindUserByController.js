"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserByController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const users_1 = require("../../../definitions/admin/users");
class FindUserByController {
    async handle(req, res) {
        const { success, data, error } = users_1.FindUserBySchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new UserAdminService_1.UserAdminService();
        const result = await service.findBy(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindUserByController = FindUserByController;
