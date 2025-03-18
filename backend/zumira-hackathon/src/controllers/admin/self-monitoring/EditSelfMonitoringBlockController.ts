import { Request, Response } from "express";

import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";
import { EditSelfMonitoringBlockSchema } from "../../../definitions/admin/self-monitoring";
import { parseZodError } from "../../../utils/parseZodError";
import { z } from "zod";

const RequestParamSchema = z.object({
  id: z.string().cuid()
})

class EditSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamSchema.parse(req.params)
    const { success, data, error } = EditSelfMonitoringBlockSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error)
      })
    }

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.update({ ...data, id })

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { EditSelfMonitoringBlocksController };
