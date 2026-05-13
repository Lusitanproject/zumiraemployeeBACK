import { Request, Response } from "express";

import { CreateAssessmentSchema } from "../../schemas/admin/assessment";
import { AssessmentService } from "../../services/assessment/AssessmentService";
import { parseZodError } from "../../utils/parseZodError";

class CreateAssessmentController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateAssessmentSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const createAssessment = new AssessmentService();
    const assessment = await createAssessment.create({ ...data });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { CreateAssessmentController };
