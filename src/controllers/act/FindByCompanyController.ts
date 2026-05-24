import { Request, Response } from "express";

import { FindByCompanySchema } from "../../schemas/admin/act-chatbot";
import { ActService } from "../../services/act/ActService";

class FindByCompanyController {
  async handle(req: Request, res: Response) {
    const data = FindByCompanySchema.parse(req.query);

    const service = new ActService();
    const result = await service.findByCompany(data.companyId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindByCompanyController };
