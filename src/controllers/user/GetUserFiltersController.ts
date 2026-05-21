import { Request, Response } from "express";

import { GetUserFiltersSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";

class GetUserFiltersController {
  async handle(req: Request, res: Response) {
    const data = GetUserFiltersSchema.parse(req.query);

    const userService = new UserService();
    const filters = await userService.getFilters(data.columns);

    return res.json({ status: "SUCCESS", data: filters });
  }
}

export { GetUserFiltersController };
