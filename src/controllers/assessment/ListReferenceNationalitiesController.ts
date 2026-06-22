import { Request, Response } from "express";

import { NationalityService } from "../../services/nationality/NationalityService";

class ListReferenceNationalitiesController {
  async handle(req: Request, res: Response) {
    const service = new NationalityService();
    const result = await service.list();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListReferenceNationalitiesController };
