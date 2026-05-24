import { Request, Response } from "express";
import { z } from "zod";

import { SearchAssessmentResultsQuerySchema } from "../../schemas/admin/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";

const RequestParams = z.object({ id: z.string().cuid() });

class SearchAssessmentResultsController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = SearchAssessmentResultsQuerySchema.parse(req.query);

    const service = new AssessmentService();
    const result = await service.searchResults(parsedParams.id, parsedQuery);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchAssessmentResultsController };
