import { Request, Response } from "express";

import { UserAdminService } from "../../../services/admin/UserAdminService";

class ListAllUsersController {
  async handle(req: Request, res: Response) {
    const userService = new UserAdminService();
    const users = await userService.findAll();

    return res.json({ status: "SUCCESS", data: { users } });
  }
}

export { ListAllUsersController };
