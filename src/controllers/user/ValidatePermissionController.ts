import { Request, Response } from "express";

import { ValidatePermissionQuerySchema } from "../../schemas/user";
import { hasPermission } from "../../utils/permissions";

class ValidatePermissionController {
  async handle(req: Request, res: Response) {
    const { permission } = ValidatePermissionQuerySchema.parse(req.query);
    return res.json({ status: "SUCCESS", data: { hasPermission: hasPermission(req.user, permission) } });
  }
}

export { ValidatePermissionController };
