import { Request, Response } from "express";
import { z } from "zod";

import { FindActAnalysisSummaryQuerySchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class FindActAnalysisSummaryController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = FindActAnalysisSummaryQuerySchema.parse(req.query);

    const { companyId, ...filters } = parsedQuery;

    const service = new ActService();
    const summary = await service.findAnalysisSummary(companyId, parsedParams.actChatbotId, filters);

    return res.json({ status: "SUCCESS", data: summary });
  }
}

export { FindActAnalysisSummaryController };
