import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../../schemas/common";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";

class FindNationalityController {
  async handle(req: Request, res: Response) {
    const data = RequestParamsIdCUID.parse(req.params);

    const service = new NationalityAdminService();
    const nationality = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { FindNationalityController };
