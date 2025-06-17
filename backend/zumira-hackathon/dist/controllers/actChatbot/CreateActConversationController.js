"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActConversationController = void 0;
const actChatbot_1 = require("../../definitions/actChatbot");
const CreateActConversationService_1 = require("../../services/actChatbot/CreateActConversationService");
const parseZodError_1 = require("../../utils/parseZodError");
class CreateActConversationController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.CreateActConversationSchema.safeParse(req.body);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const service = new CreateActConversationService_1.CreateActConversationService();
        const result = await service.execute({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateActConversationController = CreateActConversationController;
