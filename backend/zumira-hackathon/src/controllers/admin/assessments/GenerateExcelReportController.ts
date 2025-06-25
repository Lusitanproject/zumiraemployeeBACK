import { Request, Response } from "express";

import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";
import { parseZodError } from "../../../utils/parseZodError";
import { AssessmentByCompanySchema } from "../../../definitions/admin/assessment";

class GenerateExcelReportController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = AssessmentByCompanySchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentResultAdminService();
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

export { GenerateExcelReportController };
