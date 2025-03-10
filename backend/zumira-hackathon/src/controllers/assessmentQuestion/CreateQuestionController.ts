import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { CreateQuestionService } from "../../services/assessmentQuestion/CreateQuestionService";

const CreateQuestionSchema = z.object({
    description: z.string(),
    assessmentId: z.string().cuid(),
    psychologicalDimensionId: z.string().uuid(),
    choices: z.array(
        z.object({
            label: z.string(),
            value: z.number(),
        })
    ),
});

class CreateQuestionController {
    async handle(req: Request, res: Response) {
        const { success, data, error } = CreateQuestionSchema.safeParse(req.body);

        if (!success) throw new Error(parseZodError(error));

        const { description, assessmentId, psychologicalDimensionId, choices } = data;

        const createQuestion = new CreateQuestionService();
        const question = await createQuestion.execute({ description, assessmentId, psychologicalDimensionId, choices });

        return res.json({ status: "SUCCESS", data: question });
    }
}

export { CreateQuestionController };
