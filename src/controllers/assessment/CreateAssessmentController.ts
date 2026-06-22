import { Request, Response } from "express";

import { CreateAssessmentSchema } from "../../schemas/admin/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";

class CreateAssessmentController {
  async handle(req: Request, res: Response) {
    const data = CreateAssessmentSchema.parse(req.body);

    const createAssessment = new AssessmentService();
    const assessment = await createAssessment.create({
      ...data,
      companyId: req.user.companyId!,
      ownerId: req.user.id,
    });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { CreateAssessmentController };
