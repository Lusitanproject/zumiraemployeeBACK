"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActAnalysisController = void 0;
const zod_1 = require("zod");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    actChatbotId: zod_1.z.string().cuid(),
});
const RequestQuery = zod_1.z.object({
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    area: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    occupationLevel: zod_1.z.string().optional(),
    skinColor: zod_1.z.string().optional(),
    hasDisability: zod_1.z
        .string()
        .optional()
        .transform((v) => (v === undefined ? undefined : v === "true")),
    nationalityId: zod_1.z.string().cuid().optional(),
});
class FindActAnalysisController {
    async handle(req, res) {
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const queryResult = RequestQuery.safeParse(req.query);
        if (!queryResult.success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(queryResult.error),
            });
        }
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const analysis = await companyAdminService.findActAnalysis(data.companyId, data.actChatbotId, queryResult.data);
        return res.json({
            status: "SUCCESS",
            data: analysis,
        });
    }
}
exports.FindActAnalysisController = FindActAnalysisController;
