import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentService } from "../../services/assessment/AssessmentService";

const GenerateFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class GenerateCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const data = GenerateFeedbackSchema.parse(req.params);

    const { id: assessmentId } = data;
    const userId = req.user.id;

    const generateFeedback = new AssessmentService();
    const feedback = await generateFeedback.generateCompanyFeedback({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { GenerateCompanyFeedbackController };
