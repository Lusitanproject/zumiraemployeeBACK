import { Request, Response } from "express";
import { z } from "zod";

import { GetAnalysisUserFiltersSchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GetAnalysisUserFiltersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = GetAnalysisUserFiltersSchema.parse(req.query);

    const { companyId, columns } = parsedQuery;

    const service = new ActService();
    const result = await service.getAnalysisUserFilters(companyId, parsedParams.actChatbotId, columns);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAnalysisUserFiltersController };
