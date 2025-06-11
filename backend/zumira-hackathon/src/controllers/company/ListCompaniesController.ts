import { Request, Response } from "express";

import { ListCompaniesService } from "../../services/company/ListCompaniesService";
import { assertPermissions } from "../../utils/assertPermissions";

class ListCompaniesController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "read-companies");

    const listCompanies = new ListCompaniesService();
    const companies = await listCompanies.execute();

    return res.json({ status: "SUCCESS", data: companies });
  }
}

export { ListCompaniesController };
