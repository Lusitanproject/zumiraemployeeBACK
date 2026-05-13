"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActChatbotController = void 0;
const zod_1 = require("zod");
const ActService_1 = require("../../services/act/ActService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class FindActChatbotController {
    async handle(req, res) {
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActService_1.ActService();
        const result = await service.findById(data.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindActChatbotController = FindActChatbotController;
