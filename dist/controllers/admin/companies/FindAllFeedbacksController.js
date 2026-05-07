"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllFeedbacksController = void 0;
const CompanyAdminService_1 = require("../../../services/admin/CompanyAdminService");
class FindAllFeedbacksController {
    async handle(req, res) {
        const companyAdminService = new CompanyAdminService_1.CompanyAdminService();
        const feedbacks = await companyAdminService.findAllFeedbacks(req.user.id);
        return res.json({ status: "SUCCESS", data: feedbacks });
    }
}
exports.FindAllFeedbacksController = FindAllFeedbacksController;
