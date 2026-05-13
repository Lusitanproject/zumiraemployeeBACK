"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationCreateResultController = void 0;
const zod_1 = require("zod");
const common_1 = require("../../../schemas/common");
const AssessmentService_1 = require("../../../services/assessment/AssessmentService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
const CreateResultSchema = zod_1.z.object({
    assessmentId: zod_1.z.string().cuid(),
    answers: zod_1.z.array(zod_1.z.object({
        assessmentQuestionId: zod_1.z.string().uuid(),
        assessmentQuestionChoiceId: zod_1.z.string().uuid(),
    })),
});
class IntegrationCreateResultController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "answer-assessment");
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = CreateResultSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const { assessmentId, answers } = data;
        const createResult = new AssessmentService_1.AssessmentService();
        const result = await createResult.createResult({ userId, assessmentId, answers });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationCreateResultController = IntegrationCreateResultController;
