import { Request, Response } from "express";

import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";
import { z } from "zod";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParam = z.object({
  id: z.string().cuid()
})

class FindSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params)

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error)
      })
    }

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.find(data.id)

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { FindSelfMonitoringBlocksController };
