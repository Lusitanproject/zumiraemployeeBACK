import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema, UpdateAnalysisReportSchema } from "../../../../schemas/admin/act-analysis";
import { ActAnalysisService } from "../../../../services/act/ActAnalysisService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class UpdateAnalysisReportController {
  async handle(req: Request, res: Response) {
    const { actChatbotId } = RequestParams.parse(req.params);
    const { companyId } = ActAnalysisCompanyQuerySchema.parse(req.query);
    const data = UpdateAnalysisReportSchema.parse(req.body);

    const actService = new ActAnalysisService();
    const result = await actService.updateAnalysisReport(companyId, actChatbotId, data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateAnalysisReportController };
