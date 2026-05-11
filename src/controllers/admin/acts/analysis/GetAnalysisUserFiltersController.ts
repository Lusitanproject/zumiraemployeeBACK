import { Request, Response } from "express";
import { z } from "zod";

import { GetAnalysisUserFiltersSchema } from "../../../../schemas/admin/act-analysis";
import { ActAnalysisAdminService } from "../../../../services/admin/ActAnalysisAdminService";
import { parseZodError } from "../../../../utils/parseZodError";

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

    const actAnalysisService = new ActAnalysisAdminService();
    const result = await actAnalysisService.getUserFilters(
      companyId,
      parsedParams.data.actChatbotId,
      columns,
    );

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAnalysisUserFiltersController };
