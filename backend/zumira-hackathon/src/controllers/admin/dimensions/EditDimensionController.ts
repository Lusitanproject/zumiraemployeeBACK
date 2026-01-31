import { Request, Response } from "express";

import { EditDimensionSchema } from "../../../definitions/admin/dimension";
import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class EditDimensionController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = EditDimensionSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new DimensionAdminService();
    await service.edit(data);

    return res.json({ status: "SUUCESS", data: {} });
  }
}

export { EditDimensionController };
