import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../../../schemas/admin/act-analysis";
import { ActChatbotAdminService } from "../../../../services/admin/ActAdminService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GenerateActAnalysisController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = ActAnalysisCompanyQuerySchema.parse(req.query);

    const actAnalysisService = new ActChatbotAdminService();
    await actAnalysisService.generateAnalysis(parsedQuery.companyId, parsedParams.actChatbotId);

    return res.json({
      status: "SUCCESS",
      message: "Análise ACT iniciada com sucesso",
    });
  }
}

export { GenerateActAnalysisController };
