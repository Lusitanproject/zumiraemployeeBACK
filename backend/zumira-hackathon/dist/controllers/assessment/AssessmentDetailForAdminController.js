"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentDetailForAdminController = void 0;
const zod_1 = require("zod");
const AssessmentAdminService_1 = require("../../services/admin/AssessmentAdminService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const GetAssessmentDetailForAdminSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class AssessmentDetailForAdminController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "read-assessment");
        const { success, data, error } = GetAssessmentDetailForAdminSchema.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const detailAssessment = new AssessmentAdminService_1.AssessmentAdminService();
        const assessment = await detailAssessment.find(data.id);
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.AssessmentDetailForAdminController = AssessmentDetailForAdminController;
