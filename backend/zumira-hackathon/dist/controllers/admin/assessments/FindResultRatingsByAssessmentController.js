"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindResultRatingsByAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const AssessmentResultRatingAdminService_1 = require("../../../services/admin/AssessmentResultRatingAdminService");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class FindResultRatingsByAssessmentController {
    async handle(req, res) {
        const { success, data, error } = RequestParamSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AssessmentResultRatingAdminService_1.AssessmentResultRatingAdminService();
        const result = await service.findByAssessment(data.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindResultRatingsByAssessmentController = FindResultRatingsByAssessmentController;
