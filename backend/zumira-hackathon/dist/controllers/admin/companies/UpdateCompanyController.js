"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyController = void 0;
const company_1 = require("../../../definitions/admin/company");
const common_1 = require("../../../definitions/common");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdateCompanyController {
    async handle(req, res) {
        const { id } = common_1.RequestParamsIdCUID.parse(req.params);
        const { success, data, error } = company_1.UpdateCompanySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new CompanyAdminService_1.CompanyAdminService();
        const result = await service.update({ id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.UpdateCompanyController = UpdateCompanyController;
