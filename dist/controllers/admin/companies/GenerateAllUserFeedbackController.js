"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAllUserFeedbackController = void 0;
const zod_1 = require("zod");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
});
const RequestQuery = zod_1.z.object({
    sync: zod_1.z
        .string()
        .optional()
        .transform((v) => v !== "false")
        .default("true"),
});
class GenerateAllUserFeedbackController {
    async handle(req, res) {
        var _a;
        const { success, data, error } = RequestParams.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const { data: query } = RequestQuery.safeParse(req.query);
        const sync = (_a = query === null || query === void 0 ? void 0 : query.sync) !== null && _a !== void 0 ? _a : true;
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const result = await companyAdminService.generateAllUserFeedback(data.companyId, sync);
        return res.json({
            status: "SUCCESS",
            data: result,
        });
    }
}
exports.GenerateAllUserFeedbackController = GenerateAllUserFeedbackController;
