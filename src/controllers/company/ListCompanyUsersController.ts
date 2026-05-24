import { Request, Response } from "express";

import { UserService } from "../../services/user/UserService";

class ListCompanyUsersController {
  async handle(req: Request, res: Response) {
    const users = await new UserService().findByCompany(req.params.companyId);
    return res.json({ status: "SUCCESS", data: users });
  }
}

export { ListCompanyUsersController };
