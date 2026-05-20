import { Request, Response } from "express";

import { CreateDimensionSchema } from "../../../schemas/admin/dimension";
import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";
import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

class CreateDimensionController {
  async handle(req: Request, res: Response) {
    const data = CreateDimensionSchema.parse(req.body);

    const { acronym, name, selfMonitoringBlockId } = data;

    const selfMonitoringAdminService = new SelfMonitoringAdminService();
    const monitoringBlockExists = await selfMonitoringAdminService.find(selfMonitoringBlockId);

    if (!monitoringBlockExists) {
      return res.status(400).json({
        status: "ERROR",
        message: "O bloco de autoconhecimento informado não existe.",
      });
    }

    const dimensionAdminService = new DimensionAdminService();
    const dimension = await dimensionAdminService.create({ acronym, name, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: dimension });
  }
}

export { CreateDimensionController };
