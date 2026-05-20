import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../../services/user/UserService";

const FindByCompanySchema = z.object({
  companyId: z.string().cuid(),
});

class ListUsersByCompanyController {
  async handle(req: Request, res: Response) {
const data = FindByCompanySchema.parse(req.params);

    const userService = new UserService();
    const users = await userService.findByCompany(data.companyId);

    return res.json({ status: "SUCCESS", data: { users } });
  }
}

export { ListUsersByCompanyController };
