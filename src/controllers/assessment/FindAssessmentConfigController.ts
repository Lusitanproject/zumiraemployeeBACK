import { Request, Response } from "express";

import { AssessmentService } from "../../services/assessment/AssessmentService";

class FindAssessmentConfigController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;

    const service = new AssessmentService();
    const result = await service.findByIdConfig({ id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAssessmentConfigController };
