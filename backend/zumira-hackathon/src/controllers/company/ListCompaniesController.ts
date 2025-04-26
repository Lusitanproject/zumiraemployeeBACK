import { Request, Response } from "express";
import { assertPermissions } from "../../utils/assertPermissions";
import { ListCompaniesService } from "../../services/company/ListCompaniesService";

class ListCompaniesController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "read-companies");

    const listCompanies = new ListCompaniesService();
    const companies = await listCompanies.execute();

    return res.json({ status: "SUCCESS", data: companies });
  }
}

export { ListCompaniesController };
