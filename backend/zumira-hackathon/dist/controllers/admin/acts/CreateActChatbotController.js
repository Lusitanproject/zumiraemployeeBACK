"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActChatbotController = void 0;
const act_chatbot_1 = require("../../../definitions/admin/act-chatbot");
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateActChatbotController {
    async handle(req, res) {
        const { success, data, error } = act_chatbot_1.CreateActChatbotSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.create(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateActChatbotController = CreateActChatbotController;
