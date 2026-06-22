import { Request, Response } from "express";
import { z } from "zod";

import { UpdateAssessmentSchema } from "../../schemas/admin/assessment";
import { AssessmentAdminService } from "../../services/admin/AssessmentAdminService";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class UpdateAssessmentController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamSchema.parse(req.params);
    const data = UpdateAssessmentSchema.parse(req.body);

    const service = new AssessmentAdminService();
    const assessment = await service.update({ ...data, id });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { UpdateAssessmentController };
