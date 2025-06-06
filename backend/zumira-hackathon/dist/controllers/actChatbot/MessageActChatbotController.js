"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageActChatbotController = void 0;
const actChatbot_1 = require("../../definitions/actChatbot");
const parseZodError_1 = require("../../utils/parseZodError");
const MessageActChatbotService_1 = require("../../services/actChatbot/MessageActChatbotService");
class MessageActChatbotController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.MessageActChatbotSchema.safeParse(req.body);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const service = new MessageActChatbotService_1.MessageActChatbotService();
        const result = await service.execute({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.MessageActChatbotController = MessageActChatbotController;
