import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../../../schemas/admin/act-analysis";
import { ActAnalysisService } from "../../../../services/act/ActAnalysisService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class RegenerateAnalysisReportController {
  async handle(req: Request, res: Response) {
    const { actChatbotId } = RequestParams.parse(req.params);
    const { companyId } = ActAnalysisCompanyQuerySchema.parse(req.query);

    const actService = new ActAnalysisService();
    const result = await actService.regenerateAnalysisReport(companyId, actChatbotId);

    return res.json(result);
  }
}

export { RegenerateAnalysisReportController };
