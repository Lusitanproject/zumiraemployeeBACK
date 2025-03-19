"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateQuestionService_1 = require("../../services/assessment/CreateQuestionService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const CreateQuestionSchema = zod_1.z.object({
    description: zod_1.z.string(),
    index: zod_1.z.number().int(),
    assessmentId: zod_1.z.string().cuid(),
    psychologicalDimensionId: zod_1.z.string().uuid(),
    choices: zod_1.z.array(zod_1.z.object({
        label: zod_1.z.string(),
        value: zod_1.z.number(),
        index: zod_1.z.number().int(),
    })),
});
class CreateQuestionController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-question");
        const { success, data, error } = CreateQuestionSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { description, index, assessmentId, psychologicalDimensionId, choices } = data;
        const createQuestion = new CreateQuestionService_1.CreateQuestionService();
        const question = await createQuestion.execute({
            description,
            index,
            assessmentId,
            psychologicalDimensionId,
            choices,
        });
        return res.json({ status: "SUCCESS", data: question });
    }
}
exports.CreateQuestionController = CreateQuestionController;
