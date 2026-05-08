import { Request, Response } from "express";
import { z } from "zod";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  companyId: z.string().cuid(),
  actChatbotId: z.string().cuid(),
});

class GenerateAnalysisReportController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParams.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const service = new CompanyAdminService();
    const result = await service.generateAnalysisReport(data.companyId, data.actChatbotId);

    return res.json({
      status: "SUCCESS",
      data: result,
    });
  }
}

export { GenerateAnalysisReportController };
