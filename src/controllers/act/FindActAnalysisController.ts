import { Request, Response } from "express";
import { z } from "zod";

import { FindActAnalysisQuerySchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class FindActAnalysisController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = FindActAnalysisQuerySchema.parse(req.query);

    const { companyId, page, pageSize, ...filters } = parsedQuery;

    const service = new ActService();
    const analysis = await service.findAnalysis(companyId, parsedParams.actChatbotId, filters, { page, pageSize });

    return res.json({ status: "SUCCESS", data: analysis });
  }
}

export { FindActAnalysisController };
