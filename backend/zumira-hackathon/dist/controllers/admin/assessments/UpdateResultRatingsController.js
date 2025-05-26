"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResultRatingsController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const AssessmentResultRatingAdminService_1 = require("../../../services/admin/AssessmentResultRatingAdminService");
const zod_1 = require("zod");
const assessment_1 = require("../../../definitions/admin/assessment");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class UpdateResultRatingsController {
    async handle(req, res) {
        const { id: assessmentId } = RequestParamSchema.parse(req.params);
        const { success, data, error } = assessment_1.UpdateRatingsSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AssessmentResultRatingAdminService_1.AssessmentResultRatingAdminService();
        const result = await service.updateAssessmentResultRatings({ assessmentId, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.UpdateResultRatingsController = UpdateResultRatingsController;
