import { Request, Response } from "express";

import { CreateAssessmentSchema } from "../../definitions/admin/assessment";
import { CreateAssessmentService } from "../../services/assessment/CreateAssessmentService";
import { parseZodError } from "../../utils/parseZodError";

class CreateAssessmentController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateAssessmentSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const createAssessment = new CreateAssessmentService();
    const assessment = await createAssessment.execute({ ...data });

    return res.json({ status: "SUCCESS", data: assessment });
  }
}

export { CreateAssessmentController };
