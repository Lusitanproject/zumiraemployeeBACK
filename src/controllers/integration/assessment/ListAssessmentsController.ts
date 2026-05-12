import { Request, Response } from "express";

import { ListAssessmentsSchema } from "../../../schemas/assessment";
import { UserIdSchema } from "../../../schemas/common";
import { AssessmentService } from "../../../services/assessment/AssessmentService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationListAssessmentsController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = ListAssessmentsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const { userId } = userIdData;

    const listAssessments = new AssessmentService();
    const assessments = await listAssessments.list({ ...data, userId });

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { IntegrationListAssessmentsController };
