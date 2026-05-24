import { Request, Response } from "express";
import { z } from "zod";

import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";
import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

const RequestParam = z.object({
  selfMonitoringBlockId: z.string().cuid(),
});

class FindDimensionByBlockController {
  async handle(req: Request, res: Response) {
    const data = RequestParam.parse(req.params);

    const selfMonitoringAdminService = new SelfMonitoringAdminService();
    const monitoringBlockExists = await selfMonitoringAdminService.find(data.selfMonitoringBlockId);

    if (!monitoringBlockExists) {
      return res.status(400).json({
        status: "ERROR",
        message: "O bloco de autoconhecimento informado não existe.",
      });
    }

    const dimensionAdminService = new DimensionAdminService();
    const dimensions = await dimensionAdminService.findBySelfMonitoring(data.selfMonitoringBlockId);

    return res.json({ status: "SUCCESS", data: { dimensions } });
  }
}

export { FindDimensionByBlockController };
