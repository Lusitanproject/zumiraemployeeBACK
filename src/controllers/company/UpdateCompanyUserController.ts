import { Request, Response } from "express";
import { z } from "zod";

import { UpdateCompanyUserSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";

const RequestParams = z.object({ id: z.string().uuid() });

class UpdateCompanyUserController {
  async handle(req: Request, res: Response) {
    const params = RequestParams.parse(req.params);

    const body = UpdateCompanyUserSchema.parse(req.body);

    const user = await new UserService().update(
      { id: params.id, ...body },
      { companyId: req.params.companyId },
    );

    if (!user) return res.status(404).json({ status: "ERROR", message: "Usuário não encontrado" });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { UpdateCompanyUserController };
