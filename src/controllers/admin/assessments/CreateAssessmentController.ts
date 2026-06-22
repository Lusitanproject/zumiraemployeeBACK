import { Request, Response } from "express";

import { CreateAssessmentSchema } from "../../../schemas/admin/assessment";
import { AssessmentService } from "../../../services/assessment/AssessmentService";

class CreateAssessmentController {
  async handle(req: Request, res: Response) {
    const data = CreateAssessmentSchema.parse(req.body);

    const service = new AssessmentService();
    const assessment = await service.create({ ...data });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { CreateAssessmentController };
