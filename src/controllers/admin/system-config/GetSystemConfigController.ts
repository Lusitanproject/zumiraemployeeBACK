import { Request, Response } from "express";

import SystemConfigAdminService from "../../../services/admin/SystemConfigAdminService";

class GetSystemConfigController {
  async handle(_req: Request, res: Response) {
    const service = new SystemConfigAdminService();
    const result = await service.getConfig();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetSystemConfigController };
