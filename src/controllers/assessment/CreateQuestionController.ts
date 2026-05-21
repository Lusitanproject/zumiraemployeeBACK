import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentService } from "../../services/assessment/AssessmentService";

const CreateQuestionSchema = z.object({
  description: z.string(),
  index: z.number().int(),
  assessmentId: z.string().cuid(),
  psychologicalDimensionId: z.string().uuid(),
  choices: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      index: z.number().int(),
    }),
  ),
});

class CreateQuestionController {
  async handle(req: Request, res: Response) {
    const data = CreateQuestionSchema.parse(req.body);

    const { description, index, assessmentId, psychologicalDimensionId, choices } = data;

    const createQuestion = new AssessmentService();
    const question = await createQuestion.createQuestion({
      description,
      index,
      assessmentId,
      psychologicalDimensionId,
      choices,
    });

    return res.json({ status: "SUCCESS", data: question });
  }
}

export { CreateQuestionController };
