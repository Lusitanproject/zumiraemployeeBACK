import { Request, Response } from "express";
import { z } from "zod";

import { FindActAnalysisSummaryQuerySchema } from "../../../../schemas/admin/act-analysis";
import { ActAnalysisAdminService } from "../../../../services/admin/ActAnalysisAdminService";
import { parseZodError } from "../../../../utils/parseZodError";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class FindActAnalysisSummaryController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = FindActAnalysisSummaryQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const { companyId, ...filters } = parsedQuery.data;

    const actAnalysisService = new ActAnalysisAdminService();
    const summary = await actAnalysisService.findSummary(
      companyId,
      parsedParams.data.actChatbotId,
      filters,
    );

    return res.json({
      status: "SUCCESS",
      data: summary,
    });
  }
}

export { FindActAnalysisSummaryController };
