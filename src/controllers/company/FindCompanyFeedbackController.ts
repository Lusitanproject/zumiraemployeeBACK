import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../definitions/common";
import { FindCompanyFeedbackSchema } from "../../definitions/company";
import { FindCompanyFeedbackService } from "../../services/company/FindCompanyFeedbackService";
import { parseZodError } from "../../utils/parseZodError";

class FindCompanyFeedbackController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const { success, data, error } = FindCompanyFeedbackSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new FindCompanyFeedbackService();
    const result = await service.execute({ ...data, companyId: id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindCompanyFeedbackController };
