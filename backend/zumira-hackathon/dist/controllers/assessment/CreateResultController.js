"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResultController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateResultService_1 = require("../../services/assessment/CreateResultService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const CreateResultSchema = zod_1.z.object({
    assessmentId: zod_1.z.string().cuid(),
    answers: zod_1.z.array(zod_1.z.object({
        assessmentQuestionId: zod_1.z.string().uuid(),
        assessmentQuestionChoiceId: zod_1.z.string().uuid(),
    })),
});
class CreateResultController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "answer-assessment");
        const { success, data, error } = CreateResultSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const { assessmentId, answers } = data;
        const createResult = new CreateResultService_1.CreateResultService();
        const result = await createResult.execute({ userId, assessmentId, answers });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateResultController = CreateResultController;
