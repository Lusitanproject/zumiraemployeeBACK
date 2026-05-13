import { Request, Response } from "express";

import { CreateUserSchema } from "../../schemas/admin/users";
import { CompanyService } from "../../services/company/CompanyService";
import { parseZodError } from "../../utils/parseZodError";

const BodySchema = CreateUserSchema.omit({ companyId: true });

class CreateUserForCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = BodySchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new CompanyService();
    const result = await service.createUserForCompany(req.user.id, data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateUserForCompanyController };
