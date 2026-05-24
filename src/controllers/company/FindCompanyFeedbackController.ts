import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../schemas/common";
import { FindCompanyFeedbackSchema } from "../../schemas/company";
import { CompanyService } from "../../services/company/CompanyService";

class FindCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const data = FindCompanyFeedbackSchema.parse(req.query);

    const service = new CompanyService();
    const result = await service.findFeedback({ ...data, companyId: id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindCompanyFeedbackController };
