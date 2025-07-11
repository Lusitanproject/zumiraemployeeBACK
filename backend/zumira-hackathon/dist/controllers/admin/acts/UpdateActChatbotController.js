"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActChatbotController = void 0;
const act_chatbot_1 = require("../../../definitions/admin/act-chatbot");
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdateActChatbotController {
    async handle(req, res) {
        const { success, data, error } = act_chatbot_1.UpdateActChatbotSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.update(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.UpdateActChatbotController = UpdateActChatbotController;
