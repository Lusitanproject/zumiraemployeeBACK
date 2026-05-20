import { Request, Response } from "express";

import { CreateTrailSchema } from "../../../schemas/admin/trail";
import { TrailAdminService } from "../../../services/admin/TrailAdminService";

class CreateTrailController {
  async handle(req: Request, res: Response) {
    const data = CreateTrailSchema.parse(req.body);

    const service = new TrailAdminService();
    const result = await service.create(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateTrailController };
