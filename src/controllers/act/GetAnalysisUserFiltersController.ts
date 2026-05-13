import { Request, Response } from "express";
import { z } from "zod";

import { GetAnalysisUserFiltersSchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GetAnalysisUserFiltersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = GetAnalysisUserFiltersSchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const { companyId, columns } = parsedQuery.data;

    const service = new ActService();
    const result = await service.getAnalysisUserFilters(companyId, parsedParams.data.actChatbotId, columns);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAnalysisUserFiltersController };
