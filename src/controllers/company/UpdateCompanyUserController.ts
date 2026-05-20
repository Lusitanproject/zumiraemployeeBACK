import { Request, Response } from "express";
import { z } from "zod";

import { UpdateCompanyUserSchema } from "../../schemas/admin/users";
import { parseZodError } from "../../utils/parseZodError";
import { UserService } from "../../services/user/UserService";

const RequestParams = z.object({ id: z.string().uuid() });

class UpdateCompanyUserController {
  async handle(req: Request, res: Response) {
    const params = RequestParams.safeParse(req.params);
    if (!params.success) throw new Error(parseZodError(params.error));

    const body = UpdateCompanyUserSchema.safeParse(req.body);
    if (!body.success) throw new Error(parseZodError(body.error));

    const user = await new UserService().update(
      { id: params.data.id, ...body.data },
      { companyId: req.params.companyId },
    );

    if (!user) return res.status(404).json({ status: "ERROR", message: "Usuário não encontrado" });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { UpdateCompanyUserController };
