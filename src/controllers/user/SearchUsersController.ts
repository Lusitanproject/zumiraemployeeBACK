import { Request, Response } from "express";

import { SearchUsersSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";

class SearchUsersController {
  async handle(req: Request, res: Response) {
    const data = SearchUsersSchema.parse(req.query);

    const userService = new UserService();
    const result = await userService.search(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchUsersController };
