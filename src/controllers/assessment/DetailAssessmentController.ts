import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentService } from "../../services/assessment/AssessmentService";

const CreateIdSchema = z.object({
  id: z.string().cuid(),
});

class DetailAssessmentController {
  async handle(req: Request, res: Response) {
    const data = CreateIdSchema.parse(req.params);

    const userId = req.user.id;
    const { id: assessmentId } = data;

    const detailAssessment = new AssessmentService();
    const assessment = await detailAssessment.detail({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { DetailAssessmentController };
