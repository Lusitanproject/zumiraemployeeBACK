import { Request, Response } from "express";

import { FindFilteredResultsSchema } from "../../../definitions/admin/assessment";
import { AssessmentResultAdminService } from "../../../services/admin/AssessmentResultAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class FindFilteredResultsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindFilteredResultsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentResultAdminService();
    const result = await service.findFiltered(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindFilteredResultsController };
