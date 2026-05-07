import { Request, Response } from "express";

import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { PublicError } from "../../../error";

class FindRoleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const roleService = new RoleAdminService();
    const role = await roleService.find(id);

    if (!role) throw new PublicError("Perfil não encontrado");

    return res.json({ status: "SUCCESS", data: role });
  }
}

export { FindRoleController };
