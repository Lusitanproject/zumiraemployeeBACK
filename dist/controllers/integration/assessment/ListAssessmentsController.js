"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationListAssessmentsController = void 0;
const assessment_1 = require("../../../definitions/assessment");
const common_1 = require("../../../definitions/common");
const ListAssessmentsService_1 = require("../../../services/assessment/ListAssessmentsService");
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
        const listAssessments = new ListAssessmentsService_1.ListAssessmentsService();
        const assessments = await listAssessments.execute({ ...data, userId });
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.IntegrationListAssessmentsController = IntegrationListAssessmentsController;
