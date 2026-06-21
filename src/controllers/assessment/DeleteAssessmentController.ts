import { Request, Response } from "express";

import { AssessmentAdminService } from "../../services/admin/AssessmentAdminService";

class DeleteAssessmentController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;

    const service = new AssessmentAdminService();
    await service.delete(id);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeleteAssessmentController };
