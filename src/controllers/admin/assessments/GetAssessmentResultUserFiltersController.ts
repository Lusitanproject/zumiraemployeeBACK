import { Request, Response } from "express";
import { z } from "zod";

import { GetAssessmentResultUserFiltersSchema } from "../../../schemas/admin/assessment";
import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({ id: z.string().cuid() });

class GetAssessmentResultUserFiltersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedQuery = GetAssessmentResultUserFiltersSchema.safeParse(req.query);
    if (!parsedQuery.success) throw new Error(parseZodError(parsedQuery.error));

    const { companyId, columns } = parsedQuery.data;

    const service = new AssessmentResultAdminService();
    const result = await service.getUserFilters(parsedParams.data.id, companyId, columns);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetAssessmentResultUserFiltersController };
