import { Request, Response } from "express";

import { ListAssessmentsSchema } from "../../schemas/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";

class ListAssessmentsController {
  async handle(req: Request, res: Response) {
    const data = ListAssessmentsSchema.parse(req.query);

    const userId = req.user.id;

    const listAssessments = new AssessmentService();
    const assessments = await listAssessments.list({ userId, ...data });

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { ListAssessmentsController };
