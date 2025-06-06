"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderActChatbotsController = void 0;
const act_chatbot_1 = require("../../../definitions/admin/act-chatbot");
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class ReorderActChatbotsController {
    async handle(req, res) {
        const { success, data, error } = act_chatbot_1.ReorderActChatbotsSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.reorder(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ReorderActChatbotsController = ReorderActChatbotsController;
