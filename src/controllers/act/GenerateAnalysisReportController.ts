import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GenerateAnalysisReportController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = ActAnalysisCompanyQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const service = new ActService();
    const result = await service.generateAnalysisReport(parsedQuery.data.companyId, parsedParams.data.actChatbotId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GenerateAnalysisReportController };
