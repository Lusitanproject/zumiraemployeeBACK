import { Request, Response } from "express";
import { z } from "zod";

import { UserIdSchema } from "../../../definitions/common";
import { GenerateUserFeedbackService } from "../../../services/assessment/GenerateUserFeedbackService";
import { parseZodError } from "../../../utils/parseZodError";

const GenerateFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class IntegrationGenerateUserFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { id: assessmentId } = data;
    const { userId } = userIdData;

    const generateFeedback = new GenerateUserFeedbackService();
    const feedback = await generateFeedback.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { IntegrationGenerateUserFeedbackController };
