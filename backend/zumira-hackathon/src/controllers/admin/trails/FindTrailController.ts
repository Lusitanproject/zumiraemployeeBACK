import { Request, Response } from "express";

import { TrailAdminService } from "../../../services/admin/TrailAdminService";
import { RequestParamsIdCUID } from "../../../definitions/common";

class FindTrailController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);

    const service = new TrailAdminService();
    const result = await service.find(id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindTrailController };
