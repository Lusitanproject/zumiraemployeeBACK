import { Request, Response } from "express";
import { z } from "zod";

import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { parseZodError } from "../../../utils/parseZodError";

export const CreateRoleSchema = z.object({
  slug: z.string(),
});

class CreateRoleController {
  async handle(req: Request, res: Response) {
const { success, data, error } = CreateRoleSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const { slug } = data;

    const roleService = new RoleAdminService();
    const roleExists = await roleService.findBySlug(slug);

    if (roleExists) {
      return res.status(400).json({
        status: "ERROR",
        message: "Já existe um perfil com o valor informado",
      });
    }

    const role = await roleService.create(slug);

    return res.json({ status: "SUCCESS", data: role });
  }
}

export { CreateRoleController };
