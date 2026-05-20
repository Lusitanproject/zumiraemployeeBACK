import { Request, Response } from "express";
import { z } from "zod";

import { SetCompanyAssessmentsSchema } from "../../../schemas/company";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

const RequestParam = z.object({
  id: z.string().cuid(),
});

class SetCompanyAssessmentsController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParam.parse(req.params);
    const data = SetCompanyAssessmentsSchema.parse(req.body);

    const companyAdminService = new CompanyAdminService();
    const result = await companyAdminService.setCompanyAssessments({ ...data, id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SetCompanyAssessmentsController };
