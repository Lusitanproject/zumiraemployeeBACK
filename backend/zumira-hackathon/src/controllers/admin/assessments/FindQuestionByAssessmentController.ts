import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentQuestionAdminService } from "../../../services/admin/AssessmentQuestionAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParam = z.object({
  assessmentId: z.string().cuid(),
});

class FindQuestionByAssessmentController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const questionAdminService = new AssessmentQuestionAdminService();
    const questions = await questionAdminService.findByAssessment(data.assessmentId);

    return res.json({ status: "SUCCESS", data: { questions } });
  }
}

export { FindQuestionByAssessmentController };
