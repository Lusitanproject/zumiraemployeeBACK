"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuestionsController = void 0;
const zod_1 = require("zod");
const UpdateQuestionsService_1 = require("../../services/assessment/UpdateQuestionsService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
const UpdateQuestionsSchema = zod_1.z.object({
    questions: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid().optional(),
        description: zod_1.z.string().min(1),
        index: zod_1.z.number().int(),
        psychologicalDimensionId: zod_1.z.string().uuid(),
        choices: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid().optional(),
            label: zod_1.z.string().min(1),
            value: zod_1.z.number(),
            index: zod_1.z.number().int(),
        })),
    })),
});
class UpdateQuestionsController {
    async handle(req, res) {
        const { id: assessmentId } = RequestParamSchema.parse(req.params);
        const { success, data, error } = UpdateQuestionsSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const updateQuestions = new UpdateQuestionsService_1.UpdateQuestionsService();
        await updateQuestions.execute({ ...data, assessmentId });
        return res.json({ status: "SUCCESS", data: {} });
    }
}
exports.UpdateQuestionsController = UpdateQuestionsController;
