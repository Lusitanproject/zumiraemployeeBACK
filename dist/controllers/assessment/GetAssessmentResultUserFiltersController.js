"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAssessmentResultUserFiltersController = void 0;
const zod_1 = require("zod");
const assessment_1 = require("../../schemas/admin/assessment");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({ id: zod_1.z.string().cuid() });
class GetAssessmentResultUserFiltersController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = assessment_1.GetAssessmentResultUserFiltersSchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const { companyId, columns } = parsedQuery.data;
        const service = new AssessmentService_1.AssessmentService();
        const result = await service.getResultUserFilters(parsedParams.data.id, companyId, columns);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetAssessmentResultUserFiltersController = GetAssessmentResultUserFiltersController;
