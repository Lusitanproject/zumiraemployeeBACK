import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../../schemas/common";
import { AssessmentAdminService } from "../../../services/admin/AssessmentAdminService";

class DuplicateAssessmentController {
  async handle(req: Request, res: Response) {
    const data = RequestParamsIdCUID.parse(req.params);

    const service = new AssessmentAdminService();
    const result = await service.duplicate(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DuplicateAssessmentController };
