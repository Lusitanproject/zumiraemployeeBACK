import { Request, Response } from "express";

import { GetUserFiltersSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";
import { assertPermissions } from "../../utils/assertPermissions";
import { parseZodError } from "../../utils/parseZodError";

class GetUserFiltersController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = GetUserFiltersSchema.safeParse(req.query);

    if (!success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(error) });
    }

    const userService = new UserService();
    const filters = await userService.getFilters(data.columns);

    return res.json({ status: "SUCCESS", data: filters });
  }
}

export { GetUserFiltersController };
