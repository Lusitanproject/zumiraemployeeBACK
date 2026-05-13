"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCompanyFeedbackController = void 0;
const zod_1 = require("zod");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../utils/parseZodError");
const GenerateFeedbackSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class GenerateCompanyFeedbackController {
    async handle(req, res) {
        const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { id: assessmentId } = data;
        const userId = req.user.id;
        const generateFeedback = new AssessmentService_1.AssessmentService();
        const feedback = await generateFeedback.generateCompanyFeedback({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: feedback });
    }
}
exports.GenerateCompanyFeedbackController = GenerateCompanyFeedbackController;
