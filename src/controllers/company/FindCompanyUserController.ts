import { Request, Response } from "express";
import { z } from "zod";

import { parseZodError } from "../../utils/parseZodError";
import { UserService } from "../../services/user/UserService";

const RequestParams = z.object({ id: z.string().uuid() });

class FindCompanyUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParams.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const user = await new UserService().find(data.id, { companyId: req.params.companyId });

    if (!user) return res.status(404).json({ status: "ERROR", message: "Usuário não encontrado" });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { FindCompanyUserController };
