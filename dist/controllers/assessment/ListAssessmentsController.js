"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAssessmentsController = void 0;
const assessment_1 = require("../../schemas/assessment");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../utils/parseZodError");
class ListAssessmentsController {
    async handle(req, res) {
        const { success, data, error } = assessment_1.ListAssessmentsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const listAssessments = new AssessmentService_1.AssessmentService();
        const assessments = await listAssessments.list({ userId, ...data });
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.ListAssessmentsController = ListAssessmentsController;
