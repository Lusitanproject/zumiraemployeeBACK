"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAssessmentsController = void 0;
const ListAssessmentsService_1 = require("../../services/assessment/ListAssessmentsService");
const assessment_1 = require("../../definitions/assessment");
const parseZodError_1 = require("../../utils/parseZodError");
class ListAssessmentsController {
    async handle(req, res) {
        const { success, data, error } = assessment_1.ListAssessmentsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const listAssessments = new ListAssessmentsService_1.ListAssessmentsService();
        const assessments = await listAssessments.execute({ userId, ...data });
        return res.json({ status: "SUCCESS", data: assessments });
    }
}
exports.ListAssessmentsController = ListAssessmentsController;
