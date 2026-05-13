import { Request, Response } from "express";

import { NationalityService } from "../../services/nationality/NationalityService";

class ListNationalitiesController {
  async handle(req: Request, res: Response) {
    const listNationalities = new NationalityService();
    const nationalities = await listNationalities.list();

    return res.json({ status: "SUCCESS", data: nationalities });
  }
}

export { ListNationalitiesController };
