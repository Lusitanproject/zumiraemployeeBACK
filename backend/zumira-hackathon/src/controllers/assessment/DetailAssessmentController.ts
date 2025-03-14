import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { DetailAssessmentService } from "../../services/assessment/DetailAssessmentService";
import { assertPermissions } from "../../utils/assertPermissions";

const CreateIdSchema = z.object({
    id: z.string().cuid(),
});

class DetailAssessmentController {
    async handle(req: Request, res: Response) {
        assertPermissions(req.user, "read-assessment");

        const { success, data, error } = CreateIdSchema.safeParse(req.params);

        if (!success) throw new Error(parseZodError(error));

        const userId = req.user.id;
        const { id: assessmentId } = data;

        const detailAssessment = new DetailAssessmentService();
        const assessment = await detailAssessment.execute({ userId, assessmentId });

        return res.json({ status: "SUCCESS", data: assessment });
    }
}

export { DetailAssessmentController };
