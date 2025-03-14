import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { CreateQuestionService } from "../../services/assessment/CreateQuestionService";
import { assertPermissions } from "../../utils/assertPermissions";

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
        })
    ),
});

class CreateQuestionController {
    async handle(req: Request, res: Response) {
        assertPermissions(req.user, "manage-question");

        const { success, data, error } = CreateQuestionSchema.safeParse(req.body);

        if (!success) throw new Error(parseZodError(error));

        const { description, index, assessmentId, psychologicalDimensionId, choices } = data;

        const createQuestion = new CreateQuestionService();
        const question = await createQuestion.execute({
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
