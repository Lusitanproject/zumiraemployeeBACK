import { Request, Response } from "express";

import { CreateCompanySchema } from "../../../schemas/admin/company";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

class CreateCompanyController {
  async handle(req: Request, res: Response) {
const data = CreateCompanySchema.parse(req.body);

    const { name, email, trailId } = data;

    const service = new CompanyAdminService();
    const company = await service.create({ name, email, trailId });

    return res.json({ status: "SUCCESS", data: company });
  }
}

export { CreateCompanyController };
