"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCompanyAssessmentsController = void 0;
const zod_1 = require("zod");
const company_1 = require("../../../definitions/company");
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParam = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class SetCompanyAssessmentsController {
    async handle(req, res) {
        const { id } = RequestParam.parse(req.params);
        const { success, data, error } = company_1.SetCompanyAssessmentsSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const result = await companyAdminService.setCompanyAssessments({ ...data, id });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.SetCompanyAssessmentsController = SetCompanyAssessmentsController;
