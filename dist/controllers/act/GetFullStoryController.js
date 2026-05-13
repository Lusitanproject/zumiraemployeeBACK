"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFullStoryController = void 0;
const ActService_1 = require("../../services/act/ActService");
class GetFullStoryController {
    async handle(req, res) {
        const service = new ActService_1.ActService();
        const result = await service.getFullStory(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetFullStoryController = GetFullStoryController;
