"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActConversationController = void 0;
const actChatbot_1 = require("../../definitions/actChatbot");
const parseZodError_1 = require("../../utils/parseZodError");
const GetActConversationService_1 = require("../../services/actChatbot/GetActConversationService");
class GetActConversationController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.GetActConversationSchema.safeParse(req.query);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const service = new GetActConversationService_1.GetActConversationService();
        const result = await service.execute({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetActConversationController = GetActConversationController;
