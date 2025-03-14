import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { CreateResultService } from "../../services/assessment/CreateResultService";
import { assertPermissions } from "../../utils/assertPermissions";

const CreateResultSchema = z.object({
    assessmentId: z.string().cuid(),
    answers: z.array(
        z.object({
            assessmentQuestionId: z.string().uuid(),
            assessmentQuestionChoiceId: z.string().uuid(),
        })
    ),
});

class CreateResultController {
    async handle(req: Request, res: Response) {
        assertPermissions(req.user, "answer-assessment");

        const { success, data, error } = CreateResultSchema.safeParse(req.body);

        if (!success) throw new Error(parseZodError(error));

        const userId = req.user.id;
        const { assessmentId, answers } = data;

        const createResult = new CreateResultService();
        const result = await createResult.execute({ userId, assessmentId, answers });

        return res.json({ status: "SUCCESS", data: result });
    }
}

export { CreateResultController };
