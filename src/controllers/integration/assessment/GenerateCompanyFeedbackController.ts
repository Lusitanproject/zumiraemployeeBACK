import { Request, Response } from "express";
import { z } from "zod";

import { UserIdSchema } from "../../../definitions/common";
import { GenerateCompanyFeedbackService } from "../../../services/assessment/GenerateCompanyFeedbackService";
import { parseZodError } from "../../../utils/parseZodError";

const GenerateFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class IntegrationGenerateCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { id: assessmentId } = data;
    const { userId } = userIdData;

    const generateFeedback = new GenerateCompanyFeedbackService();
    const feedback = await generateFeedback.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { IntegrationGenerateCompanyFeedbackController };
