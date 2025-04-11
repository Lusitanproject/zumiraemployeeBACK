import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../../utils/parseZodError";
import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";

const RequestParam = z.object({
  psychologicalDimensionId: z.string().uuid(),
});

class FindDimensionController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new DimensionAdminService();
    const dimension = await service.find(data.psychologicalDimensionId);

    return res.json({ status: "SUCCESS", data: dimension });
  }
}

export { FindDimensionController };
