import { Request, Response } from "express";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { FindAllFeedbacksSchema } from "../../../definitions/admin/company";
import { parseZodError } from "../../../utils/parseZodError";

class FindAllFeedbacksController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindAllFeedbacksSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const companyAdminService = new CompanyAdminService();
    const feedbacks = await companyAdminService.findAllFeedbacks(data.companyId);

    return res.json({ status: "SUCCESS", data: { feedbacks } });
  }
}

export { FindAllFeedbacksController };
