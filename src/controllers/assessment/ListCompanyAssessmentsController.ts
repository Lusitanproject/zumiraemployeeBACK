import { Request, Response } from "express";

import { AssessmentService } from "../../services/assessment/AssessmentService";

class ListCompanyAssessmentsController {
  async handle(req: Request, res: Response) {
    const listCompanyAssessments = new AssessmentService();
    const assessments = await listCompanyAssessments.listByCompany(req.user.id);

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { ListCompanyAssessmentsController };
