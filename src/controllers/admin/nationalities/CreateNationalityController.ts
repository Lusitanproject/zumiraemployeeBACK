import { Request, Response } from "express";

import { CreateNationalitySchema } from "../../../schemas/admin/nationality";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";

class CreateNationalityController {
  async handle(req: Request, res: Response) {
    const data = CreateNationalitySchema.parse(req.body);

    const service = new NationalityAdminService();
    const nationality = await service.create(data);

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { CreateNationalityController };
