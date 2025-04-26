import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { assertPermissions } from "../../utils/assertPermissions";
import { AssessmentAdminService } from "../../services/admin/AssessmentAdminService";

const GetAssessmentDetailForAdminSchema = z.object({
  id: z.string().cuid(),
});

class AssessmentDetailForAdminController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "read-assessment");

    const { success, data, error } = GetAssessmentDetailForAdminSchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const detailAssessment = new AssessmentAdminService();
    const assessment = await detailAssessment.find(data.id);

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { AssessmentDetailForAdminController };
