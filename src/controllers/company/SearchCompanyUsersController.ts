import { Request, Response } from "express";

import { SearchUsersSchema } from "../../schemas/admin/users";
import { parseZodError } from "../../utils/parseZodError";
import { UserService } from "../../services/user/UserService";

class SearchCompanyUsersController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = SearchUsersSchema.safeParse(req.query);
    if (!success) throw new Error(parseZodError(error));

    const result = await new UserService().search({ ...data, companyId: req.params.companyId });
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchCompanyUsersController };
