import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentAdminService } from "../../services/admin/AssessmentAdminService";

const GetAssessmentDetailForAdminSchema = z.object({
  id: z.string().cuid(),
});

class AssessmentDetailForAdminController {
  async handle(req: Request, res: Response) {
    const data = GetAssessmentDetailForAdminSchema.parse(req.params);

    const detailAssessment = new AssessmentAdminService();
    const assessment = await detailAssessment.find(data.id);

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { AssessmentDetailForAdminController };
