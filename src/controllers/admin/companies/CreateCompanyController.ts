import { Request, Response } from "express";

import { CreateCompanySchema } from "../../../schemas/admin/company";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateCompanyController {
  async handle(req: Request, res: Response) {
const { success, data, error } = CreateCompanySchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const { name, email, trailId } = data;

    const service = new CompanyAdminService();
    const company = await service.create({ name, email, trailId });

    return res.json({ status: "SUCCESS", data: company });
  }
}

export { CreateCompanyController };
