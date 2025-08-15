import { Request, Response } from "express";

import { AssessmentAdminService } from "../../../services/admin/AssessmentAdminService";

class FindAllAssessmentsController {
  async handle(req: Request, res: Response) {
    const service = new AssessmentAdminService();
    const result = await service.findAll();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAllAssessmentsController };
