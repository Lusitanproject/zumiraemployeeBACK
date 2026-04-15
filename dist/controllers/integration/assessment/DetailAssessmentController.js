"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationDetailAssessmentController = void 0;
const zod_1 = require("zod");
const common_1 = require("../../../definitions/common");
const DetailAssessmentService_1 = require("../../../services/assessment/DetailAssessmentService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
const CreateIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class IntegrationDetailAssessmentController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "read-assessment");
        const { success, data, error } = CreateIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const { id: assessmentId } = data;
        const detailAssessment = new DetailAssessmentService_1.DetailAssessmentService();
        const assessment = await detailAssessment.execute({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.IntegrationDetailAssessmentController = IntegrationDetailAssessmentController;
