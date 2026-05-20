import { Request, Response } from "express";

import { UpdateNationalitySchema } from "../../../schemas/admin/nationality";
import { RequestParamsIdCUID } from "../../../schemas/common";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";

class UpdateNationalityController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const data = UpdateNationalitySchema.parse(req.body);

    const service = new NationalityAdminService();
    const nationality = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { UpdateNationalityController };
