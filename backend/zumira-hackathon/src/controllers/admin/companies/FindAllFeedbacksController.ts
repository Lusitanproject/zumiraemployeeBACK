import { Request, Response } from "express";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

class FindAllFeedbacksController {
  async handle(req: Request, res: Response) {
    const companyAdminService = new CompanyAdminService();
    const feedbacks = await companyAdminService.findAllFeedbacks(req.user.id);

    return res.json({ status: "SUCCESS", data: feedbacks });
  }
}

export { FindAllFeedbacksController };
