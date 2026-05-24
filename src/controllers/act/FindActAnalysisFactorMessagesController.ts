import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisCompanyQuerySchema } from "../../schemas/admin/act-analysis";
import { ActService } from "../../services/act/ActService";

const RequestParams = z.object({
  actChatbotId: z.string().cuid(),
  factorId: z.string().cuid(),
});

class FindActAnalysisFactorMessagesController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = ActAnalysisCompanyQuerySchema.parse(req.query);

    const service = new ActService();
    const result = await service.findAnalysisFactorMessages(
      parsedQuery.companyId,
      parsedParams.actChatbotId,
      parsedParams.factorId,
    );

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActAnalysisFactorMessagesController };
