"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnalysisUserFiltersController = void 0;
const zod_1 = require("zod");
const act_analysis_1 = require("../../../../schemas/admin/act-analysis");
const ActAnalysisAdminService_1 = require("../../../../services/admin/ActAnalysisAdminService");
const parseZodError_1 = require("../../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
});
class GetAnalysisUserFiltersController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedQuery = act_analysis_1.GetAnalysisUserFiltersSchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedQuery.error));
        const { companyId, columns } = parsedQuery.data;
        const actAnalysisService = new ActAnalysisAdminService_1.ActAnalysisAdminService();
        const result = await actAnalysisService.getUserFilters(companyId, parsedParams.data.actChatbotId, columns);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetAnalysisUserFiltersController = GetAnalysisUserFiltersController;
