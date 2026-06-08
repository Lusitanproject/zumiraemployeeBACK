import { Request, Response } from "express";

import { UpdateSystemConfigSchema } from "../../../schemas/admin/system-config";
import SystemConfigAdminService from "../../../services/admin/SystemConfigAdminService";

class UpdateSystemConfigController {
  async handle(req: Request, res: Response) {
    const data = UpdateSystemConfigSchema.parse(req.body);

    const service = new SystemConfigAdminService();
    const result = await service.update(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateSystemConfigController };
