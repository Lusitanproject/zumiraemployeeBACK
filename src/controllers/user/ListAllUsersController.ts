import { Request, Response } from "express";

import { UserService } from "../../services/user/UserService";

class ListAllUsersController {
  async handle(req: Request, res: Response) {
    const userService = new UserService();
    const users = await userService.findAll();

    return res.json({ status: "SUCCESS", data: { users } });
  }
}

export { ListAllUsersController };
