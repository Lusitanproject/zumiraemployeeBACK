import { Request, Response } from "express";

import { DimensionAdminService } from "../../../services/admin/DimensionAdminService";

class FindAllDimensionsController {
  async handle(req: Request, res: Response) {
    const dimensionAdminService = new DimensionAdminService();
    const dimensions = await dimensionAdminService.findAll();

    return res.json({ status: "SUCCESS", data: { dimensions } });
  }
}

export { FindAllDimensionsController };
