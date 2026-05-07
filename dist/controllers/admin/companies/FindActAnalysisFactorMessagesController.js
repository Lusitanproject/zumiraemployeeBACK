"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActAnalysisFactorMessagesController = void 0;
const zod_1 = require("zod");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    actChatbotId: zod_1.z.string().cuid(),
    factorId: zod_1.z.string().cuid(),
});
class FindActAnalysisFactorMessagesController {
    async handle(req, res) {
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const result = await companyAdminService.findActAnalysisFactorMessages(data.companyId, data.actChatbotId, data.factorId);
        return res.json({
            status: "SUCCESS",
            data: result,
        });
    }
}
exports.FindActAnalysisFactorMessagesController = FindActAnalysisFactorMessagesController;
