import { Request, Response } from "express";

import { UpdateTrailSchema } from "../../../schemas/admin/trail";
import { RequestParamsIdCUID } from "../../../schemas/common";
import { TrailAdminService } from "../../../services/admin/TrailAdminService";

class UpdateTrailController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const data = UpdateTrailSchema.parse(req.body);

    const service = new TrailAdminService();
    const result = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateTrailController };
