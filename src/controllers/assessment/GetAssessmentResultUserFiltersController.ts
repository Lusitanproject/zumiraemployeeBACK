import { Request, Response } from "express";
import { z } from "zod";

import { GetAssessmentResultUserFiltersSchema } from "../../schemas/admin/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";

const RequestParams = z.object({ id: z.string().cuid() });

class GetAssessmentResultUserFiltersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedQuery = GetAssessmentResultUserFiltersSchema.parse(req.query);

    const { companyId, columns } = parsedQuery;

    const service = new AssessmentService();
    const result = await service.getResultUserFilters(parsedParams.id, companyId, columns);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAssessmentResultUserFiltersController };
