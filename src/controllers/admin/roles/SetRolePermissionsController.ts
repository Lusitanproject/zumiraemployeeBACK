import { Request, Response } from "express";
import { z } from "zod";

import { ALL_PERMISSIONS } from "../../../permissions";
import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { PublicError } from "../../../error";

const SetRolePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

class SetRolePermissionsController {
  async handle(req: Request, res: Response) {
    const data = SetRolePermissionsSchema.parse(req.body);

    const invalid = data.permissions.filter((p) => !ALL_PERMISSIONS.includes(p as never));
    if (invalid.length > 0) {
      return res.status(400).json({
        status: "ERROR",
        message: `Permissões inválidas: ${invalid.join(", ")}`,
      });
    }

    const { id: roleId } = req.params;

    const roleService = new RoleAdminService();

    const role = await roleService.find(roleId);
    if (!role) throw new PublicError("Perfil não encontrado");

    await roleService.setPermissions(roleId, data.permissions);

    return res.json({ status: "SUCCESS" });
  }
}

export { SetRolePermissionsController };
