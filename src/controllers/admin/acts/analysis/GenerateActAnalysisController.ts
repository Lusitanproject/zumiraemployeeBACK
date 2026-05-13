import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../../../schemas/admin/act-analysis";
import { ActChatbotAdminService } from "../../../../services/admin/ActAdminService";
import { parseZodError } from "../../../../utils/parseZodError";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
});

class GenerateActAnalysisController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = ActAnalysisCompanyQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const actAnalysisService = new ActChatbotAdminService();
    await actAnalysisService.generateAnalysis(parsedQuery.data.companyId, parsedParams.data.actChatbotId);

    return res.json({
      status: "SUCCESS",
      message: "Análise ACT iniciada com sucesso",
    });
  }
}

export { GenerateActAnalysisController };
