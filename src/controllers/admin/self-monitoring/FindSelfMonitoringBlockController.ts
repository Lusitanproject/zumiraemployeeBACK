import { Request, Response } from "express";
import { z } from "zod";

import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

const RequestParam = z.object({
  id: z.string().cuid(),
});

class FindSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const data = RequestParam.parse(req.params);

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.find(data.id);

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { FindSelfMonitoringBlocksController };
