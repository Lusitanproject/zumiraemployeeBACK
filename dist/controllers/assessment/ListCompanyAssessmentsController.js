"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompanyAssessmentsController = void 0;
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
class ListCompanyAssessmentsController {
    async handle(req, res) {
        const listCompanyAssessments = new AssessmentService_1.AssessmentService();
        const assessments = await listCompanyAssessments.listByCompany(req.user.id);
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.ListCompanyAssessmentsController = ListCompanyAssessmentsController;
