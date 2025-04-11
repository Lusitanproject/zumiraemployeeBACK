import { Request, Response } from "express";
import { ListAssessmentsService } from "../../services/assessment/ListAssessmentsService";
import { ListAssessmentsSchema } from "../../definitions/assessment";
import { parseZodError } from "../../utils/parseZodError";

class ListAssessmentsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListAssessmentsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const listAssessments = new ListAssessmentsService();
    const assessments = await listAssessments.execute({ userId, ...data });

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { ListAssessmentsController };
