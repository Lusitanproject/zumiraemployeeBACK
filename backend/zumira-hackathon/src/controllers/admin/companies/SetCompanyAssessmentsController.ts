import { Request, Response } from "express";
import { z } from "zod";

import { SetCompanyAssessmentsSchema } from "../../../definitions/company";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParam = z.object({
  id: z.string().cuid(),
});

class SetCompanyAssessmentsController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParam.parse(req.params);
    const { success, data, error } = SetCompanyAssessmentsSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const companyAdminService = new CompanyAdminService();
    const result = await companyAdminService.setCompanyAssessments({ ...data, id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SetCompanyAssessmentsController };
