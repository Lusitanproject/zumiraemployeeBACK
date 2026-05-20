import { Request, Response } from "express";

import { CreateManyUsersSchema, CreateUserSchema } from "../../../schemas/admin/users";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateManyUsersController {
  async handle(req: Request, res: Response) {
const { success, data, error } = CreateManyUsersSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const userService = new UserAdminService();
    const result = await userService.createMany(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateManyUsersController };
