"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeedbackController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const UpdateFeedbackService_1 = require("../../services/selfMonitoringBlock/UpdateFeedbackService");
const UpdateFeedbackSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class UpdateFeedbackController {
    async handle(req, res) {
        const { success, data, error } = UpdateFeedbackSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { id: selfMonitoringBlockId } = data;
        const userId = req.user.id;
        const updateFeedback = new UpdateFeedbackService_1.UpdateFeedbackService();
        const feedback = await updateFeedback.execute({ userId, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: feedback });
    }
}
exports.UpdateFeedbackController = UpdateFeedbackController;
