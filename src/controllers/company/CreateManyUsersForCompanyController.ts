import { Request, Response } from "express";
import { z } from "zod";

import { CreateUserSchema } from "../../schemas/admin/users";
import { CompanyService } from "../../services/company/CompanyService";
import { parseZodError } from "../../utils/parseZodError";

const BodySchema = z.array(CreateUserSchema.omit({ companyId: true })).min(1);

class CreateManyUsersForCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = BodySchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new CompanyService();
    const result = await service.createManyUsersForCompany(req.user.id, data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateManyUsersForCompanyController };
