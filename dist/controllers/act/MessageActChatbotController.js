"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageActChatbotController = void 0;
const actChatbot_1 = require("../../schemas/actChatbot");
const ActService_1 = require("../../services/act/ActService");
const parseZodError_1 = require("../../utils/parseZodError");
class MessageActChatbotController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.MessageActChatbotSchema.safeParse(req.body);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActService_1.ActService();
        const result = await service.message({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.MessageActChatbotController = MessageActChatbotController;
