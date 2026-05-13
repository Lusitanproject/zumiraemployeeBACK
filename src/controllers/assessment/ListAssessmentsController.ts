import { Request, Response } from "express";

import { ListAssessmentsSchema } from "../../schemas/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";
import { parseZodError } from "../../utils/parseZodError";

class ListAssessmentsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListAssessmentsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const listAssessments = new AssessmentService();
    const assessments = await listAssessments.list({ userId, ...data });

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { ListAssessmentsController };
