"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchAssessmentResultsController = void 0;
const zod_1 = require("zod");
const assessment_1 = require("../../schemas/admin/assessment");
const AssessmentService_1 = require("../../services/assessment/AssessmentService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({ id: zod_1.z.string().cuid() });
class SearchAssessmentResultsController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = assessment_1.SearchAssessmentResultsQuerySchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const service = new AssessmentService_1.AssessmentService();
        const result = await service.searchResults(parsedParams.data.id, parsedQuery.data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.SearchAssessmentResultsController = SearchAssessmentResultsController;
