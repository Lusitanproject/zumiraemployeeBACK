import { Request, Response } from "express";
import { z } from "zod";

import { UpdateRatingsSchema } from "../../../schemas/admin/assessment";
import { AssessmentResultRatingAdminService } from "../../../services/admin/AssessmentResultRatingAdminService";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class UpdateResultRatingsController {
  async handle(req: Request, res: Response) {
    const { id: assessmentId } = RequestParamSchema.parse(req.params);
    const data = UpdateRatingsSchema.parse(req.body);

    const service = new AssessmentResultRatingAdminService();
    const result = await service.updateAssessmentResultRatings({ assessmentId, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateResultRatingsController };
