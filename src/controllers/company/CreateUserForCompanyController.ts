import { Request, Response } from "express";

import { CreateUserSchema } from "../../schemas/admin/users";
import { UserAdminService } from "../../services/admin/UserAdminService";
import { PublicError } from "../../error";

const BodySchema = CreateUserSchema.omit({ companyId: true });

class CreateUserForCompanyController {
  async handle(req: Request, res: Response) {
    const data = BodySchema.parse(req.body);

    if (!req.user.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const result = await new UserAdminService().create({ ...data, companyId: req.user.companyId });
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateUserForCompanyController };
