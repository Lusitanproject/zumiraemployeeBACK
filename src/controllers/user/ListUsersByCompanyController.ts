import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../../services/user/UserService";
import { parseZodError } from "../../utils/parseZodError";

const FindByCompanySchema = z.object({
  companyId: z.string().cuid(),
});

class ListUsersByCompanyController {
  async handle(req: Request, res: Response) {
const { success, data, error } = FindByCompanySchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(error) });
    }

    const userService = new UserService();
    const users = await userService.findByCompany(data.companyId);

    return res.json({ status: "SUCCESS", data: { users } });
  }
}

export { ListUsersByCompanyController };
