import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { GenerateUserFeedbackService } from "../../services/assessment/GenerateUserFeedbackService";

const GenerateFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class GenerateUserFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { id: assessmentId } = data;
    const userId = req.user.id;

    const generateFeedback = new GenerateUserFeedbackService();
    const feedback = await generateFeedback.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { GenerateUserFeedbackController };
