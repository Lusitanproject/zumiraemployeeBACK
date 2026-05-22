import { Request, Response } from "express";

import { SearchUsersSchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";

class SearchCompanyUsersController {
  async handle(req: Request, res: Response) {
    const data = SearchUsersSchema.parse(req.query);

    const result = await new UserService().search({ ...data, companyId: req.params.companyId });
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SearchCompanyUsersController };
