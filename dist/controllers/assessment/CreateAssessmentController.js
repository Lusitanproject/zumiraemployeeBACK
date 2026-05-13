"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentController = void 0;
const assessment_1 = require("../../schemas/admin/assessment");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../utils/parseZodError");
class CreateAssessmentController {
    async handle(req, res) {
        const { success, data, error } = assessment_1.CreateAssessmentSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const createAssessment = new AssessmentService_1.AssessmentService();
        const assessment = await createAssessment.create({ ...data });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.CreateAssessmentController = CreateAssessmentController;
