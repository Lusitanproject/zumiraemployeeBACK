import { Request, Response } from "express";
import { z } from "zod";

import { UserIdSchema } from "../../../schemas/common";
import { AssessmentService } from "../../../services/assessment/AssessmentService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class IntegrationDetailResultController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamSchema.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { id: assessmentId } = data;
    const { userId } = userIdData;

    const service = new AssessmentService();
    const result = await service.detailResult({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationDetailResultController };
