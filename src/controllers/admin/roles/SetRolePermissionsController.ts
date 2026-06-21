import { Request, Response } from "express";
import { z } from "zod";

import { PublicError } from "../../../error";
import { RoleAdminService } from "../../../services/admin/RoleAdminService";

const SetRolePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

class SetRolePermissionsController {
  async handle(req: Request, res: Response) {
    const data = SetRolePermissionsSchema.parse(req.body);

    const { id: roleId } = req.params;

    const roleService = new RoleAdminService();

    const role = await roleService.find(roleId);
    if (!role) throw new PublicError("Perfil não encontrado");

    const { ignored } = await roleService.setPermissions(roleId, data.permissions);

    return res.json({
      status: "SUCCESS",
      ...(ignored.length > 0 && {
        message: `As seguintes permissões não existem e foram ignoradas: ${ignored.join(", ")}`,
        ignoredPermissions: ignored,
      }),
    });
  }
}

export { SetRolePermissionsController };
