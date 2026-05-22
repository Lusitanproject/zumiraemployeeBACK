import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../../services/user/UserService";

const RequestParams = z.object({ id: z.string().uuid() });

class DeleteCompanyUserController {
  async handle(req: Request, res: Response) {
    const data = RequestParams.parse(req.params);

    const deleted = await new UserService().delete(data.id, { companyId: req.params.companyId });

    if (!deleted) return res.status(404).json({ status: "ERROR", message: "Usuário não encontrado" });

    return res.json({ status: "SUCCESS" });
  }
}

export { DeleteCompanyUserController };
