import { Request, Response } from "express";
import { z } from "zod";

import { SearchAssessmentResultsQuerySchema } from "../../../schemas/admin/assessment";
import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({ id: z.string().cuid() });

class SearchAssessmentResultsController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = SearchAssessmentResultsQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const service = new AssessmentResultAdminService();
    const result = await service.search(parsedParams.data.id, parsedQuery.data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchAssessmentResultsController };
