import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../../utils/parseZodError";
import { AssessmentResultRatingAdminService } from "../../../services/admin/AssessmentResultRatingAdminService";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class FindResultRatingsByAssessmentController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new AssessmentResultRatingAdminService();
    const result = await service.findByAssessment(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindResultRatingsByAssessmentController };
