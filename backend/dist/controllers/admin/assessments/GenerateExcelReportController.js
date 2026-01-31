"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateExcelReportController = void 0;
const assessment_1 = require("../../../definitions/admin/assessment");
const AssessmentResultAdminService_1 = require("../../../services/admin/AssessmentResultAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class GenerateExcelReportController {
    async handle(req, res) {
        const { success, data, error } = assessment_1.AssessmentByCompanySchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AssessmentResultAdminService_1.AssessmentResultAdminService();
        const workbook = await service.generateExcelReport(data);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        const rawName = workbook.worksheets[0].name;
        const safeName = rawName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/[^a-zA-Z0-9-_ ]/g, "") // remove caracteres especiais
            .replace(/\s+/g, "_"); // substitui espaços por _
        res.setHeader("Content-Disposition", `attachment; filename=${safeName}.xlsx`);
        await workbook.xlsx.write(res);
        return res.end();
    }
}
exports.GenerateExcelReportController = GenerateExcelReportController;
