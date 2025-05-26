import { Request, Response } from "express";
import { parseZodError } from "../../../utils/parseZodError";
import { AssessmentResultRatingAdminService } from "../../../services/admin/AssessmentResultRatingAdminService";
import { z } from "zod";
import { UpdateRatingsSchema } from "../../../definitions/admin/assessment";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class UpdateResultRatingsController {
  async handle(req: Request, res: Response) {
    const { id: assessmentId } = RequestParamSchema.parse(req.params);
    const { success, data, error } = UpdateRatingsSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentResultRatingAdminService();
    const result = await service.updateAssessmentResultRatings({ assessmentId, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateResultRatingsController };
