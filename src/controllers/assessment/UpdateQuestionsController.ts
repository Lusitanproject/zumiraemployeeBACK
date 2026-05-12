import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentService } from "../../services/assessment/AssessmentService";
import { parseZodError } from "../../utils/parseZodError";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

const UpdateQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().uuid().optional(),
      description: z.string().min(1),
      index: z.number().int(),
      psychologicalDimensionId: z.string().uuid(),
      choices: z.array(
        z.object({
          id: z.string().uuid().optional(),
          label: z.string().min(1),
          value: z.number(),
          index: z.number().int(),
        }),
      ),
    }),
  ),
});

class UpdateQuestionsController {
  async handle(req: Request, res: Response) {
    const { id: assessmentId } = RequestParamSchema.parse(req.params);
    const { success, data, error } = UpdateQuestionsSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const updateQuestions = new AssessmentService();
    await updateQuestions.updateQuestions({ ...data, assessmentId });

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { UpdateQuestionsController };
