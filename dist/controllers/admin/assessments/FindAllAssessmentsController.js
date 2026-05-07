"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllAssessmentsController = void 0;
const AssessmentAdminService_1 = require("../../../services/admin/AssessmentAdminService");
class FindAllAssessmentsController {
    async handle(req, res) {
        const service = new AssessmentAdminService_1.AssessmentAdminService();
        const result = await service.findAll();
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindAllAssessmentsController = FindAllAssessmentsController;
