import { Request, Response } from "express";
import { z } from "zod";

import { UpdateUserSchema } from "../../schemas/admin/users";
import { CompanyService } from "../../services/company/CompanyService";
import { RoleAdminService } from "../../services/admin/RoleAdminService";
import { UserService } from "../../services/user/UserService";
import { assertPermissions } from "../../utils/assertPermissions";
import { parseZodError } from "../../utils/parseZodError";

const RequestParams = z.object({
  id: z.string().uuid(),
});

class UpdateUserController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { id } = RequestParams.parse(req.params);
    const { success, data, error } = UpdateUserSchema.safeParse(req.body);

    if (!success) {
      throw new Error(parseZodError(error));
    }

    const { roleId, companyId } = data;

    if (roleId) {
      const roleService = new RoleAdminService();
      const role = await roleService.find(roleId);

      if (!role) {
        return res.status(400).json({ status: "ERROR", message: "O perfil de usuário informado é inválido" });
      }

      if (role.slug === "admin" && req.user.role !== "admin") {
        return res.status(400).json({
          status: "ERROR",
          message: "O usuário não tem permissão para realizar essa operação.",
        });
      }
    }

    if (companyId) {
      const companyService = new CompanyService();
      const company = await companyService.find(companyId);

      if (!company) {
        return res.status(400).json({ status: "ERROR", message: "A empresa informada não é válida" });
      }
    }

    const userService = new UserService();
    const user = await userService.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { UpdateUserController };
