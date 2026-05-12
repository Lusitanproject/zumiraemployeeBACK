import { Request, Response } from "express";

import { UserIdSchema } from "../../../schemas/common";
import { AssessmentService } from "../../../services/assessment/AssessmentService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationListResultsController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;

    const service = new AssessmentService();
    const results = await service.listResults(userId);

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { IntegrationListResultsController };
