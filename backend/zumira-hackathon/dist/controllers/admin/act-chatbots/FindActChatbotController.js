"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActChatbotController = void 0;
const zod_1 = require("zod");
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class FindActChatbotController {
    async handle(req, res) {
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.find(data.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindActChatbotController = FindActChatbotController;
