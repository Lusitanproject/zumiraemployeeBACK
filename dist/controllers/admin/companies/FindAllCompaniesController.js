"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCompaniesController = void 0;
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
class FindAllCompaniesController {
    async handle(req, res) {
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const companies = await companyAdminService.findAll();
        return res.json({ status: "SUCCESS", data: { companies } });
    }
}
exports.FindAllCompaniesController = FindAllCompaniesController;
