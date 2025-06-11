import { Request, Response } from "express";
import { z } from "zod";

import { UpdateAssessmentSchema } from "../../../definitions/admin/assessment";
import { AssessmentAdminService } from "../../../services/admin/AssessmentAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class UpdateAssessmentController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamSchema.parse(req.params);
    const { success, data, error } = UpdateAssessmentSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const assessmentAdminService = new AssessmentAdminService();
    const assessment = await assessmentAdminService.update({ ...data, id });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { UpdateAssessmentController };
