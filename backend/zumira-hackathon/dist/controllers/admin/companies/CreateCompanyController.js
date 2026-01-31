"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyController = void 0;
const company_1 = require("../../../definitions/admin/company");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const assertPermissions_1 = require("../../../utils/assertPermissions");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateCompanyController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-company");
        const { success, data, error } = company_1.CreateCompanySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { name, email, trailId } = data;
        const service = new CompanyAdminService_1.CompanyAdminService();
        const company = await service.create({ name, email, trailId });
        return res.json({ status: "SUCCESS", data: company });
    }
}
exports.CreateCompanyController = CreateCompanyController;
