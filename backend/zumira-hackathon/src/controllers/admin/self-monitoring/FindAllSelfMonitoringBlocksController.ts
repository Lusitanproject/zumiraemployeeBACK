import { Request, Response } from "express";

import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

class ListAllSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const selfMonitoringService = new SelfMonitoringAdminService();
    const blocks = await selfMonitoringService.findAll();

    return res.json({ status: "SUCCESS", data: { blocks } });
  }
}

export { ListAllSelfMonitoringBlocksController };
