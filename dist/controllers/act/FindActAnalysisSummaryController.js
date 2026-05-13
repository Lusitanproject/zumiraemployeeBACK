"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActAnalysisSummaryController = void 0;
const zod_1 = require("zod");
const act_analysis_1 = require("../../schemas/admin/act-analysis");
const ActService_1 = require("../../services/act/ActService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
});
class FindActAnalysisSummaryController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = act_analysis_1.FindActAnalysisSummaryQuerySchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const { companyId, ...filters } = parsedQuery.data;
        const service = new ActService_1.ActService();
        const summary = await service.findAnalysisSummary(companyId, parsedParams.data.actChatbotId, filters);
        return res.json({ status: "SUCCESS", data: summary });
    }
}
exports.FindActAnalysisSummaryController = FindActAnalysisSummaryController;
