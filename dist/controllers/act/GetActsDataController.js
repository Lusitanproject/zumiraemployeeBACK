"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActsDataController = void 0;
const ActService_1 = require("../../services/act/ActService");
class GetActsDataController {
    async handle(req, res) {
        const service = new ActService_1.ActService();
        const result = await service.list(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetActsDataController = GetActsDataController;
