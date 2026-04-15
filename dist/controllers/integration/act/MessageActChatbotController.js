"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMessageActChatbotController = void 0;
const actChatbot_1 = require("../../../definitions/actChatbot");
const common_1 = require("../../../definitions/common");
const MessageActChatbotService_1 = require("../../../services/act/MessageActChatbotService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationMessageActChatbotController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = actChatbot_1.MessageActChatbotSchema.safeParse(req.body);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const service = new MessageActChatbotService_1.MessageActChatbotService();
        const result = await service.execute({ ...data, userId });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationMessageActChatbotController = IntegrationMessageActChatbotController;
