import { Request, Response } from "express";

import { SearchUsersSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";
import { assertPermissions } from "../../utils/assertPermissions";
import { parseZodError } from "../../utils/parseZodError";

class SearchUsersController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = SearchUsersSchema.safeParse(req.query);

    if (!success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(error) });
    }

    const userService = new UserService();
    const result = await userService.search(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchUsersController };
