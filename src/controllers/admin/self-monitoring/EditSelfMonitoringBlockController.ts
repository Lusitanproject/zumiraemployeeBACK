import { Request, Response } from "express";
import { z } from "zod";

import { EditSelfMonitoringBlockSchema } from "../../../schemas/admin/self-monitoring";
import { SelfMonitoringAdminService } from "../../../services/admin/SelfMonitoringService";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class EditSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamSchema.parse(req.params);
    const data = EditSelfMonitoringBlockSchema.parse(req.body);

    const selfMonitoringService = new SelfMonitoringAdminService();
    const block = await selfMonitoringService.update({ ...data, id });

    return res.json({ status: "SUCCESS", data: block });
  }
}

export { EditSelfMonitoringBlocksController };
