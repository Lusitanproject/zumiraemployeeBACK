"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFullStoryController = void 0;
const GetFullStoryService_1 = require("../../services/actChatbot/GetFullStoryService");
class GetFullStoryController {
    async handle(req, res) {
        const service = new GetFullStoryService_1.GetFullStoryService();
        const result = await service.execute(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetFullStoryController = GetFullStoryController;
