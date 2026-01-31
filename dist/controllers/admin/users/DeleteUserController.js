"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserController = void 0;
const common_1 = require("../../../definitions/common");
const UserAdminService_1 = require("../../../services/admin/UserAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class DeleteUserController {
    async handle(req, res) {
        const { success, data, error } = common_1.RequestParamsIdUUID.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new UserAdminService_1.UserAdminService();
        const result = await service.delete(data.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.DeleteUserController = DeleteUserController;
