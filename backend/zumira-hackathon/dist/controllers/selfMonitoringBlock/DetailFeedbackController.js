"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailUserFeedbackController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const DetailFeedbackService_1 = require("../../services/selfMonitoringBlock/DetailFeedbackService");
const DetailFeedbackSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class DetailUserFeedbackController {
    async handle(req, res) {
        const { success, data, error } = DetailFeedbackSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { id: selfMonitoringBlockId } = data;
        const userId = req.user.id;
        const detailFeedback = new DetailFeedbackService_1.DetailUserFeedbackService();
        const feedback = await detailFeedback.execute({ userId, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: feedback });
    }
}
exports.DetailUserFeedbackController = DetailUserFeedbackController;
