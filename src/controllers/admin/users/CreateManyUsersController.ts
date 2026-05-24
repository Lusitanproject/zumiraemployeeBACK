import { Request, Response } from "express";

import { CreateManyUsersSchema } from "../../../schemas/admin/users";
import { UserAdminService } from "../../../services/admin/UserAdminService";

class CreateManyUsersController {
  async handle(req: Request, res: Response) {
    const data = CreateManyUsersSchema.parse(req.body);

    const userService = new UserAdminService();
    const result = await userService.createMany(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateManyUsersController };
