import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../../definitions/common";
import { AssessmentAdminService } from "../../../services/admin/AssessmentAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class DuplicateAssessmentController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamsIdCUID.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentAdminService();
    const result = await service.duplicate(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DuplicateAssessmentController };
