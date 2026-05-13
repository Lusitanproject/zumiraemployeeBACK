"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailAssessmentController = void 0;
const zod_1 = require("zod");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class DetailAssessmentController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "read-assessment");
        const { success, data, error } = CreateIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const { id: assessmentId } = data;
        const detailAssessment = new AssessmentService_1.AssessmentService();
        const assessment = await detailAssessment.detail({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.DetailAssessmentController = DetailAssessmentController;
