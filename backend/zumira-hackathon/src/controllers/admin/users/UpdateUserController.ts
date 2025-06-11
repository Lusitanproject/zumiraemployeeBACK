import { Request, Response } from "express";
import { z } from "zod";

import { UpdateUserSchema } from "../../../definitions/admin/users";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { assertPermissions } from "../../../utils/assertPermissions";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  id: z.string().uuid(),
});

class UpdateUserController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { id } = RequestParams.parse(req.params);
    const { success, data, error } = UpdateUserSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const { name, roleId, companyId } = data;

    if (roleId) {
      const roleService = new RoleAdminService();
      const role = await roleService.find(roleId);

      if (!role) {
        return res.status(400).json({
          status: "ERROR",
          message: "O perfil de usuário informado é inválido",
        });
      }

      if (role.slug === "admin" && req.user.role !== "admin") {
        return res.status(400).json({
          status: "ERROR",
          message: "O usuário não tem permissão para realizar essa operação.",
        });
      }
    }

    if (companyId) {
      const companyService = new CompanyAdminService();
      const company = await companyService.find(companyId);

      if (!company) {
        return res.status(400).json({
          status: "ERROR",
          message: "A empresa informada não é válida",
        });
      }
    }

    const userService = new UserAdminService();
    const user = await userService.update({ id, name, roleId, companyId });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { UpdateUserController };
