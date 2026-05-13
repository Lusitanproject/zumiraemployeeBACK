import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../schemas/common";
import { FindCompanyFeedbackSchema } from "../../schemas/company";
import { CompanyService } from "../../services/company/CompanyService";
import { parseZodError } from "../../utils/parseZodError";

class FindCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const { success, data, error } = FindCompanyFeedbackSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new CompanyService();
    const result = await service.findFeedback({ ...data, companyId: id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindCompanyFeedbackController };
