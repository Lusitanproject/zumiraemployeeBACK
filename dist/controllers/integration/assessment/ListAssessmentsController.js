"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationListAssessmentsController = void 0;
const assessment_1 = require("../../../schemas/assessment");
const common_1 = require("../../../schemas/common");
const AssessmentService_1 = require("../../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationListAssessmentsController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = assessment_1.ListAssessmentsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const listAssessments = new AssessmentService_1.AssessmentService();
        const assessments = await listAssessments.list({ ...data, userId });
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.IntegrationListAssessmentsController = IntegrationListAssessmentsController;
