import { Request, Response } from "express";

import { UpdateCompanySchema } from "../../../definitions/admin/company";
import { RequestParamsIdCUID } from "../../../definitions/common";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateCompanyController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const { success, data, error } = UpdateCompanySchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new CompanyAdminService();
    const result = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateCompanyController };
