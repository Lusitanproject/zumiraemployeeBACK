import { Request, Response } from "express";

import { AssessmentService } from "../../services/assessment/AssessmentService";

class FindAssessmentsPanelController {
  async handle(req: Request, res: Response) {
    const service = new AssessmentService();
    const result = await service.findForPanel(req.user);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAssessmentsPanelController };
