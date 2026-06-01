import { Request, Response } from "express";

import { ValidatePermissionQuerySchema } from "../../schemas/user";

class ValidatePermissionController {
  async handle(req: Request, res: Response) {
    const { permission } = ValidatePermissionQuerySchema.parse(req.query);
    const hasPermission = req.user.role === "admin" || req.user.permissions.includes(permission);
    return res.json({ status: "SUCCESS", data: { hasPermission } });
  }
}

export { ValidatePermissionController };
