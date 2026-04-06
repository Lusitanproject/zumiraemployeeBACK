import { Request, Response } from "express";
import { z } from "zod";

import { UserIdSchema } from "../../../definitions/common";
import { DetailAssessmentService } from "../../../services/assessment/DetailAssessmentService";
import { assertPermissions } from "../../../utils/assertPermissions";
import { parseZodError } from "../../../utils/parseZodError";

const CreateIdSchema = z.object({
  id: z.string().cuid(),
});

class IntegrationDetailAssessmentController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "read-assessment");

    const { success, data, error } = CreateIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;
    const { id: assessmentId } = data;

    const detailAssessment = new DetailAssessmentService();
    const assessment = await detailAssessment.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { IntegrationDetailAssessmentController };
