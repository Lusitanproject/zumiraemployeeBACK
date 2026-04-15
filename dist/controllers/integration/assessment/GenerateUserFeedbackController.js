"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGenerateUserFeedbackController = void 0;
const zod_1 = require("zod");
const common_1 = require("../../../definitions/common");
const GenerateUserFeedbackService_1 = require("../../../services/assessment/GenerateUserFeedbackService");
const parseZodError_1 = require("../../../utils/parseZodError");
const GenerateFeedbackSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class IntegrationGenerateUserFeedbackController {
    async handle(req, res) {
        const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { id: assessmentId } = data;
        const { userId } = userIdData;
        const generateFeedback = new GenerateUserFeedbackService_1.GenerateUserFeedbackService();
        const feedback = await generateFeedback.execute({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: feedback });
    }
}
exports.IntegrationGenerateUserFeedbackController = IntegrationGenerateUserFeedbackController;
