import { Request, Response } from "express";

import { CreateUserSchema } from "../../../definitions/admin/users";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { assertPermissions } from "../../../utils/assertPermissions";
import { parseZodError } from "../../../utils/parseZodError";

class CreateUserController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = CreateUserSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const { name, email, roleId, companyId } = data;

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
    const emailExists = await userService.findByEmail(email);

    if (emailExists) {
      return res.status(400).json({
        status: "ERROR",
        message: "Já exista uma conta em uso com o email informado",
      });
    }

    const user = await userService.create({ name, email, roleId, companyId });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { CreateUserController };
