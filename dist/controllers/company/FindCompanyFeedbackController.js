"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCompanyFeedbackController = void 0;
const common_1 = require("../../schemas/common");
const company_1 = require("../../schemas/company");
const CompanyService_1 = require("../../services/company/CompanyService");
const parseZodError_1 = require("../../utils/parseZodError");
class FindCompanyFeedbackController {
    async handle(req, res) {
        const { id } = common_1.RequestParamsIdCUID.parse(req.params);
        const { success, data, error } = company_1.FindCompanyFeedbackSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new CompanyService_1.CompanyService();
        const result = await service.findFeedback({ ...data, companyId: id });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindCompanyFeedbackController = FindCompanyFeedbackController;
