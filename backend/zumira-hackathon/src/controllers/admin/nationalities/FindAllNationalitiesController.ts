import { Request, Response } from "express";

import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";

class FindAllNationalitiesController {
  async handle(req: Request, res: Response) {
    const service = new NationalityAdminService();
    const nationalities = await service.findAll();

    return res.json({ status: "SUCCESS", data: nationalities });
  }
}

export { FindAllNationalitiesController };
