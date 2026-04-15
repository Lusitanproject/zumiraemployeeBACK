import { Request, Response } from "express";

import { ListAssessmentsSchema } from "../../../definitions/assessment";
import { UserIdSchema } from "../../../definitions/common";
import { ListAssessmentsService } from "../../../services/assessment/ListAssessmentsService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationListAssessmentsController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = ListAssessmentsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const { userId } = userIdData;

    const listAssessments = new ListAssessmentsService();
    const assessments = await listAssessments.execute({ ...data, userId });

    return res.json({ status: "SUCCESS", data: assessments });
  }
}

export { IntegrationListAssessmentsController };
