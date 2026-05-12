import { Request, Response } from "express";

import { AssessmentService } from "../../services/assessment/AssessmentService";

class ListResultsController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const service = new AssessmentService();
    const results = await service.listResults(userId);

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { ListResultsController };
