"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const DetailAssessmentService_1 = require("../../services/assessment/DetailAssessmentService");
const assertPermissions_1 = require("../../utils/assertPermissions");
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
        const detailAssessment = new DetailAssessmentService_1.DetailAssessmentService();
        const assessment = await detailAssessment.execute({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.DetailAssessmentController = DetailAssessmentController;
