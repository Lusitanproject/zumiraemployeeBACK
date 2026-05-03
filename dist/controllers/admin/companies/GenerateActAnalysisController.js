"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateActAnalysisController = void 0;
const zod_1 = require("zod");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    actChatbotId: zod_1.z.string().cuid(),
});
class GenerateActAnalysisController {
    async handle(req, res) {
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        await companyAdminService.generateActAnalysis(data.companyId, data.actChatbotId);
        return res.json({
            status: "SUCCESS",
            message: "Análise ACT iniciada com sucesso",
        });
    }
}
exports.GenerateActAnalysisController = GenerateActAnalysisController;
