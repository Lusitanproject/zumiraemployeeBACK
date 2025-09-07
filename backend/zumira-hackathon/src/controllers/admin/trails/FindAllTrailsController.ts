import { Request, Response } from "express";

import { TrailAdminService } from "../../../services/admin/TrailAdminService";

class FindAllTrailsController {
  async handle(req: Request, res: Response) {
    const service = new TrailAdminService();
    const result = await service.findAll();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAllTrailsController };
