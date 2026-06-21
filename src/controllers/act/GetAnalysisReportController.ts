import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../schemas/admin/act-analysis";
import { ActAnalysisService } from "../../services/act/ActAnalysisService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GetAnalysisReportController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = ActAnalysisCompanyQuerySchema.parse(req.query);

    const service = new ActAnalysisService();
    const result = await service.getAnalysisReport(parsedQuery.companyId, parsedParams.actChatbotId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAnalysisReportController };
