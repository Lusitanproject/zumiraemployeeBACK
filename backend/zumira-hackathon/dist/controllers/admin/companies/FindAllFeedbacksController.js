"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllFeedbacksController = void 0;
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
const company_1 = require("../../../definitions/admin/company");
const parseZodError_1 = require("../../../utils/parseZodError");
class FindAllFeedbacksController {
    async handle(req, res) {
        const { success, data, error } = company_1.FindAllFeedbacksSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const feedbacks = await companyAdminService.findAllFeedbacks(data.companyId);
        return res.json({ status: "SUCCESS", data: { feedbacks } });
    }
}
exports.FindAllFeedbacksController = FindAllFeedbacksController;
