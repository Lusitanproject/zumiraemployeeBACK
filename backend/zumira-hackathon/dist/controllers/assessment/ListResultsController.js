"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListResultsController = void 0;
const ListResultsService_1 = require("../../services/assessment/ListResultsService");
class ListResultsController {
    async handle(req, res) {
        const userId = req.user.id;
        const service = new ListResultsService_1.ListResultsService();
        const results = await service.execute(userId);
        return res.json({ status: "SUCCESS", data: results });
    }
}
exports.ListResultsController = ListResultsController;
