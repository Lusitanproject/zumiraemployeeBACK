"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAssessmentsController = void 0;
const ListAssessmentsService_1 = require("../../services/assessment/ListAssessmentsService");
class ListAssessmentsController {
    async handle(req, res) {
        const userId = req.user.id;
        const listAssessments = new ListAssessmentsService_1.ListAssessmentsService();
        const assessments = await listAssessments.execute(userId);
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.ListAssessmentsController = ListAssessmentsController;
