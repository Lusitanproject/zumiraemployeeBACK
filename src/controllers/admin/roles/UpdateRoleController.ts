import { Request, Response } from "express";
import { z } from "zod";

import { RoleAdminService } from "../../../services/admin/RoleAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const UpdateRoleSchema = z.object({
  slug: z.string().nonempty(),
});

class UpdateRoleController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateRoleSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(error) });
    }

    const { id } = req.params;

    const roleService = new RoleAdminService();

    const slugInUse = await roleService.findBySlug(data.slug);
    if (slugInUse && slugInUse.id !== id) {
      return res.status(400).json({
        status: "ERROR",
        message: "Já existe um perfil com o valor informado",
      });
    }

    const role = await roleService.update({ id, slug: data.slug });

    return res.json({ status: "SUCCESS", data: role });
  }
}

export { UpdateRoleController };
