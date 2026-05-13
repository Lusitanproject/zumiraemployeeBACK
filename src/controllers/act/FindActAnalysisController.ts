import { Request, Response } from "express";
import { z } from "zod";

import { FindActAnalysisQuerySchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class FindActAnalysisController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = FindActAnalysisQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const { companyId, page, pageSize, ...filters } = parsedQuery.data;

    const service = new ActService();
    const analysis = await service.findAnalysis(companyId, parsedParams.data.actChatbotId, filters, { page, pageSize });

    return res.json({ status: "SUCCESS", data: analysis });
  }
}

export { FindActAnalysisController };
