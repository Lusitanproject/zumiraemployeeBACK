import { Request, Response } from "express";

import { CreateSelfMonitoringBlockSchema } from "../../../schemas/admin/self-monitoring";
import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

class CreateSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const data = CreateSelfMonitoringBlockSchema.parse(req.body);

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.create(data);

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { CreateSelfMonitoringBlocksController };
