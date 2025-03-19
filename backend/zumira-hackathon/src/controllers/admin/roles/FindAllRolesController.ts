import { Request, Response } from "express";

import { RoleAdminService } from "../../../services/admin/RoleAdminService";

class FindAllRolesController {
  async handle(req: Request, res: Response) {
    const roleAdminService = new RoleAdminService();
    const roles = await roleAdminService.findAll()

    return res.json({ status: "SUCCESS", data: { roles } });
  }
}

export { FindAllRolesController };
