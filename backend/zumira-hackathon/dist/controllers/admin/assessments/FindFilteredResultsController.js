"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindFilteredResultsController = void 0;
const assessment_1 = require("../../../definitions/admin/assessment");
const AssessmentResultAdminService_1 = require("../../../services/admin/AssessmentResultAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class FindFilteredResultsController {
    async handle(req, res) {
        const { success, data, error } = assessment_1.AssessmentByCompanySchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AssessmentResultAdminService_1.AssessmentResultAdminService();
        const result = await service.findFiltered(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindFilteredResultsController = FindFilteredResultsController;
