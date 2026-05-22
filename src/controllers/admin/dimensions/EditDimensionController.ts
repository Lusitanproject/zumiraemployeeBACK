import { Request, Response } from "express";

import { EditDimensionSchema } from "../../../schemas/admin/dimension";
import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";

class EditDimensionController {
  async handle(req: Request, res: Response) {
    const data = EditDimensionSchema.parse(req.body);

    const service = new DimensionAdminService();
    await service.edit(data);

    return res.json({ status: "SUUCESS", data: {} });
  }
}

export { EditDimensionController };
