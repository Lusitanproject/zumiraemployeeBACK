"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllActChatbotsController = void 0;
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
class FindAllActChatbotsController {
    async handle(req, res) {
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.findAll();
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindAllActChatbotsController = FindAllActChatbotsController;
