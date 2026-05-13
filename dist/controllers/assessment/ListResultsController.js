"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListResultsController = void 0;
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
class ListResultsController {
    async handle(req, res) {
        const userId = req.user.id;
        const service = new AssessmentService_1.AssessmentService();
        const results = await service.listResults(userId);
        return res.json({ status: "SUCCESS", data: results });
    }
}
exports.ListResultsController = ListResultsController;
