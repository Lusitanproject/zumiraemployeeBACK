"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateActAnalysisController = void 0;
const zod_1 = require("zod");
const act_analysis_1 = require("../../../../schemas/admin/act-analysis");
const ActAnalysisAdminService_1 = require("../../../../services/admin/ActAnalysisAdminService");
const parseZodError_1 = require("../../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
});
class GenerateActAnalysisController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = act_analysis_1.ActAnalysisCompanyQuerySchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const actAnalysisService = new ActAnalysisAdminService_1.ActAnalysisAdminService();
        await actAnalysisService.generate(parsedQuery.data.companyId, parsedParams.data.actChatbotId);
        return res.json({
            status: "SUCCESS",
            message: "Análise ACT iniciada com sucesso",
        });
    }
}
exports.GenerateActAnalysisController = GenerateActAnalysisController;
