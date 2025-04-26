"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCompanyController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const RequestParam = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
});
class FindCompanyController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const company = await companyAdminService.find(data.companyId);
        if (!company) {
            return res.status(400).json({
                status: "ERROR",
                message: "Empresa não encontrada não encontrado.",
            });
        }
        return res.json({ status: "SUCCESS", data: company });
    }
}
exports.FindCompanyController = FindCompanyController;
