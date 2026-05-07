"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompanyAssessmentsController = void 0;
const ListCompanyAssessmentsService_1 = require("../../services/assessment/ListCompanyAssessmentsService");
class ListCompanyAssessmentsController {
    async handle(req, res) {
        const listCompanyAssessments = new ListCompanyAssessmentsService_1.ListCompanyAssessmentsService();
        const assessments = await listCompanyAssessments.execute(req.user.id);
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.ListCompanyAssessmentsController = ListCompanyAssessmentsController;
