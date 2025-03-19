"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const assessment_1 = require("../../../definitions/admin/assessment");
const AssessmentAdminService_1 = require("../../../services/admin/AssessmentAdminService");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid()
});
class UpdateAssessmentController {
    async handle(req, res) {
        const { id } = RequestParamSchema.parse(req.params);
        const { success, data, error } = assessment_1.UpdateAssessmentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error)
            });
        }
        const assessmentAdminService = new AssessmentAdminService_1.AssessmentAdminService();
        const assessment = await assessmentAdminService.update({ ...data, id });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.UpdateAssessmentController = UpdateAssessmentController;
