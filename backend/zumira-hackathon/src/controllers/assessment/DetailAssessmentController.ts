import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { DetailAssessmentService } from "../../services/assessment/DetailAssessmentService";

const CreateIdSchema = z.object({
    id: z.string().cuid(),
});

class DetailAssessmentController {
    async handle(req: Request, res: Response) {
        const { success, data, error } = CreateIdSchema.safeParse(req.params);

        if (!success) throw new Error(parseZodError(error));

        // @ts-ignore
        const userId = req.userId;
        const { id: assessmentId } = data;

        const detailAssessment = new DetailAssessmentService();
        const assessment = await detailAssessment.execute({ userId, assessmentId });

        return res.json({ status: "SUCCESS", data: assessment });
    }
}

export { DetailAssessmentController };
