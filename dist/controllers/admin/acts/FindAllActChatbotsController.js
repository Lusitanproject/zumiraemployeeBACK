"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllActChatbotsController = void 0;
const ActAdminService_1 = require("../../../services/admin/ActAdminService");
class FindAllActChatbotsController {
    async handle(req, res) {
        const service = new ActAdminService_1.ActChatbotAdminService();
        const result = await service.findAll();
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindAllActChatbotsController = FindAllActChatbotsController;
