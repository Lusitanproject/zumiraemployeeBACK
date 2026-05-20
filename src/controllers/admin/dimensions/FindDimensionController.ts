import { Request, Response } from "express";
import { z } from "zod";

import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";

const RequestParam = z.object({
  psychologicalDimensionId: z.string().uuid(),
});

class FindDimensionController {
  async handle(req: Request, res: Response) {
    const data = RequestParam.parse(req.params);

    const service = new DimensionAdminService();
    const dimension = await service.find(data.psychologicalDimensionId);

    return res.json({ status: "SUCCESS", data: dimension });
  }
}

export { FindDimensionController };
