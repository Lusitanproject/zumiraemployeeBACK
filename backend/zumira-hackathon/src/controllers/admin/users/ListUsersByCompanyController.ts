import { Request, Response } from "express";
import { z } from "zod";

import { UserAdminService } from "../../../services/admin/UserAdminService";
import { assertPermissions } from "../../../utils/assertPermissions";
import { parseZodError } from "../../../utils/parseZodError";

const FindByCompanySchema = z.object({
  companyId: z.string().cuid(),
});

class ListUsersByCompanyController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = FindByCompanySchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const { companyId } = data;

    const userService = new UserAdminService();
    const users = await userService.findByCompany(companyId);

    return res.json({ status: "SUCCESS", data: { users } });
  }
}

export { ListUsersByCompanyController };
