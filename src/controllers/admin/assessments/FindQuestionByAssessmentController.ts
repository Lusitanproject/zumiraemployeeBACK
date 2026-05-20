import { Request, Response } from "express";
import { z } from "zod";

import { AssessmentQuestionAdminService } from "../../../services/admin/AssessmentQuestionAdminService";

const RequestParam = z.object({
  assessmentId: z.string().cuid(),
});

class FindQuestionByAssessmentController {
  async handle(req: Request, res: Response) {
    const data = RequestParam.parse(req.params);

    const questionAdminService = new AssessmentQuestionAdminService();
    const questions = await questionAdminService.findByAssessment(data.assessmentId);

    return res.json({ status: "SUCCESS", data: { questions } });
  }
}

export { FindQuestionByAssessmentController };
