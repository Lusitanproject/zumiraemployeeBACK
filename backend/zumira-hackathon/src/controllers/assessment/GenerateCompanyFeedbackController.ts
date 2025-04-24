import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { GenerateCompanyFeedbackService } from "../../services/assessment/GenerateCompanyFeedbackService";

const GenerateFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class GenerateCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GenerateFeedbackSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { id: assessmentId } = data;
    const userId = req.user.id;

    const generateFeedback = new GenerateCompanyFeedbackService();
    const feedback = await generateFeedback.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { GenerateCompanyFeedbackController };
