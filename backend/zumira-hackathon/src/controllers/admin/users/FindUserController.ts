import { Request, Response } from "express";
import { z } from "zod";

import { parseZodError } from "../../../utils/parseZodError";
import { UserAdminService } from "../../../services/admin/UserAdminService";

const RequestParam = z.object({
  userId: z.string().uuid()
})

class FindUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params)

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error)
      })
    }

    const userAdminService = new UserAdminService();
    const user = await userAdminService.find(data.userId)

    if (!user) {
      return res.status(400).json({
        status: "ERROR",
        message: "Usuário não encontrado."
      })
    }

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { FindUserController };
