import { Request, Response } from "express";

import { ListCompanyAssessmentsService } from "../../services/assessment/ListCompanyAssessmentsService";

class ListCompanyAssessmentsController {
  async handle(req: Request, res: Response) {
    const listCompanyAssessments = new ListCompanyAssessmentsService();
    const assessments = await listCompanyAssessments.execute(req.user.id);

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { ListCompanyAssessmentsController };
