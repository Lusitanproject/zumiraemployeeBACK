import { Request, Response } from "express";

import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";
import { CreateSelfMonitoringBlockSchema } from "../../../definitions/admin/self-monitoring";
import { parseZodError } from "../../../utils/parseZodError";

class CreateSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateSelfMonitoringBlockSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error)
      })
    }

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.create(data)

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { CreateSelfMonitoringBlocksController };
