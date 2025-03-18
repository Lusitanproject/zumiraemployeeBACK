import { Request, Response } from "express";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

class FindAllCompaniesController {
  async handle(req: Request, res: Response) {
    const companyAdminService = new CompanyAdminService();
    const companies = await companyAdminService.findAll()

    return res.json({ status: "SUCCESS", data: { companies } });
  }
}

export { FindAllCompaniesController };
