"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindQuestionByAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const AssessmentQuestionAdminService_1 = require("../../../services/admin/AssessmentQuestionAdminService");
const RequestParam = zod_1.z.object({
    assessmentId: zod_1.z.string().cuid(),
});
class FindQuestionByAssessmentController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const questionAdminService = new AssessmentQuestionAdminService_1.AssessmentQuestionAdminService();
        const questions = await questionAdminService.findByAssessment(data.assessmentId);
        return res.json({ status: "SUCCESS", data: { questions } });
    }
}
exports.FindQuestionByAssessmentController = FindQuestionByAssessmentController;
