"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateAssessmentService_1 = require("../../services/assessment/CreateAssessmentService");
const CreateAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string(),
    summary: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
class CreateAssessmentController {
    async handle(req, res) {
        const { success, data, error } = CreateAssessmentSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { title, summary, description, selfMonitoringBlockId } = data;
        const createAssessment = new CreateAssessmentService_1.CreateAssessmentService();
        const assessment = await createAssessment.execute({ title, summary, description, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: assessment });
    }
}
exports.CreateAssessmentController = CreateAssessmentController;
