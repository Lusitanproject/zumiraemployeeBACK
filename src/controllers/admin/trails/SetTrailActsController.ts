import { Request, Response } from "express";

import { SetTrailActsSchema } from "../../../schemas/admin/trail";
import { TrailAdminService } from "../../../services/admin/TrailAdminService";

class SetTrailActsController {
  async handle(req: Request, res: Response) {
    const trailId = req.params.trailId as string;
    const data = SetTrailActsSchema.parse(req.body);

    const service = new TrailAdminService();
    await service.setActs({ trailId, ...data });

    return res.json({ status: "SUCCESS" });
  }
}

export { SetTrailActsController };
