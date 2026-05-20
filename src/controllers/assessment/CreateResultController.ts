import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentService } from "../../services/assessment/AssessmentService";

const CreateResultSchema = z.object({
  assessmentId: z.string().cuid(),
  answers: z.array(
    z.object({
      assessmentQuestionId: z.string().uuid(),
      assessmentQuestionChoiceId: z.string().uuid(),
    }),
  ),
});

class CreateResultController {
  async handle(req: Request, res: Response) {
const data = CreateResultSchema.parse(req.body);

    const userId = req.user.id;
    const { assessmentId, answers } = data;

    const createResult = new AssessmentService();
    const result = await createResult.createResult({ userId, assessmentId, answers });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateResultController };
