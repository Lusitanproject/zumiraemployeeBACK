"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncUsersPreviewController = void 0;
const user_1 = require("../../schemas/user");
const UserService_1 = require("../../services/user/UserService");
const parseZodError_1 = require("../../utils/parseZodError");
class SyncUsersPreviewController {
    async handle(req, res) {
        const parsedParams = user_1.SyncCompanyParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(parsedParams.error) });
        }
        const parsedBody = user_1.SyncUsersPayloadSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ status: "ERROR", message: (0, parseZodError_1.parseZodError)(parsedBody.error) });
        }
        const result = await new UserService_1.UserService().previewSync(parsedParams.data.id, parsedBody.data.users);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.SyncUsersPreviewController = SyncUsersPreviewController;
