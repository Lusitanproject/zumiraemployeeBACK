"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActAnalysisController = void 0;
const zod_1 = require("zod");
const act_analysis_1 = require("../../schemas/admin/act-analysis");
const ActService_1 = require("../../services/act/ActService");
const parseZodError_1 = require("../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
});
class FindActAnalysisController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = act_analysis_1.FindActAnalysisQuerySchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const { companyId, page, pageSize, ...filters } = parsedQuery.data;
        const service = new ActService_1.ActService();
        const analysis = await service.findAnalysis(companyId, parsedParams.data.actChatbotId, filters, { page, pageSize });
        return res.json({ status: "SUCCESS", data: analysis });
    }
}
exports.FindActAnalysisController = FindActAnalysisController;
