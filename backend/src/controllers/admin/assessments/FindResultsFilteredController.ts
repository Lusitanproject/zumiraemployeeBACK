import { Request, Response } from "express";

import { AssessmentByCompanySchema } from "../../../definitions/admin/assessment";
import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class FindResultsFilteredController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = AssessmentByCompanySchema.safeParse(req.query);
    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentResultAdminService();
    const result = await service.findFiltered(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindResultsFilteredController };
