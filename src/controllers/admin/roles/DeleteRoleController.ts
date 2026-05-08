import { Request, Response } from "express";

import { RoleAdminService } from "../../../services/admin/RoleAdminService";

class DeleteRoleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const roleService = new RoleAdminService();
    await roleService.delete(id);

    return res.json({ status: "SUCCESS" });
  }
}

export { DeleteRoleController };
