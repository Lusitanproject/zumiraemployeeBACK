import { Request, Response } from "express";

import { CreateManyUsersSchema, CreateUserSchema } from "../../../definitions/admin/users";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { assertPermissions } from "../../../utils/assertPermissions";
import { parseZodError } from "../../../utils/parseZodError";

class CreateManyUsersController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = CreateManyUsersSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const userService = new UserAdminService();
    const result = await userService.createMany(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateManyUsersController };
