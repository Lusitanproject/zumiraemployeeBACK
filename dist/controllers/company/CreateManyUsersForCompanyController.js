"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateManyUsersForCompanyController = void 0;
const zod_1 = require("zod");
const users_1 = require("../../schemas/admin/users");
const CompanyService_1 = require("../../services/company/CompanyService");
const parseZodError_1 = require("../../utils/parseZodError");
const BodySchema = zod_1.z.array(users_1.CreateUserSchema.omit({ companyId: true })).min(1);
class CreateManyUsersForCompanyController {
    async handle(req, res) {
        const { success, data, error } = BodySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new CompanyService_1.CompanyService();
        const result = await service.createManyUsersForCompany(req.user.id, data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateManyUsersForCompanyController = CreateManyUsersForCompanyController;
