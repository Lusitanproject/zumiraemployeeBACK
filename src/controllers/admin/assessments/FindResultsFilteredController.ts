import { Request, Response } from "express";

import { AssessmentByCompanySchema } from "../../../schemas/admin/assessment";
import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";

class FindResultsFilteredController {
  async handle(req: Request, res: Response) {
    const data = AssessmentByCompanySchema.parse(req.query);

    const service = new AssessmentResultAdminService();
    const result = await service.findFiltered(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindResultsFilteredController };
