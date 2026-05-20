import { Request, Response } from "express";
import { z } from "zod";

import { CreateUserSchema } from "../../schemas/admin/users";
import { UserAdminService } from "../../services/admin/UserAdminService";
import { parseZodError } from "../../utils/parseZodError";
import { PublicError } from "../../error";

const BodySchema = z.array(CreateUserSchema.omit({ companyId: true })).min(1);

class CreateManyUsersForCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = BodySchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    if (!req.user.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const companyId = req.user.companyId;
    const result = await new UserAdminService().createMany(data.map((u) => ({ ...u, companyId })));
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateManyUsersForCompanyController };
