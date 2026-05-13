"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserForCompanyController = void 0;
const users_1 = require("../../schemas/admin/users");
const CompanyService_1 = require("../../services/company/CompanyService");
const parseZodError_1 = require("../../utils/parseZodError");
const BodySchema = users_1.CreateUserSchema.omit({ companyId: true });
class CreateUserForCompanyController {
    async handle(req, res) {
        const { success, data, error } = BodySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new CompanyService_1.CompanyService();
        const result = await service.createUserForCompany(req.user.id, data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateUserForCompanyController = CreateUserForCompanyController;
