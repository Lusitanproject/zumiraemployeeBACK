import { Request, Response } from "express";

import { FindByCompanySchema } from "../../schemas/admin/act-chatbot";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

class FindByCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindByCompanySchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActService();
    const result = await service.findByCompany(data.companyId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindByCompanyController };
