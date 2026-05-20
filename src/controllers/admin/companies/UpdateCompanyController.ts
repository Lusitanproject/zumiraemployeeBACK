import { Request, Response } from "express";

import { UpdateCompanySchema } from "../../../schemas/admin/company";
import { RequestParamsIdCUID } from "../../../schemas/common";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

class UpdateCompanyController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const data = UpdateCompanySchema.parse(req.body);

    const service = new CompanyAdminService();
    const result = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateCompanyController };
