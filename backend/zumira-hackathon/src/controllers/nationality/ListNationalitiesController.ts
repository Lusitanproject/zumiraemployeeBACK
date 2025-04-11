import { Request, Response } from "express";
import { ListNationalitiesService } from "../../services/nationality/ListNationalitiesService";

class ListNationalitiesController {
  async handle(req: Request, res: Response) {
    const listNationalities = new ListNationalitiesService();
    const nationalities = await listNationalities.execute();

    return res.json({ status: "SUCCESS", data: nationalities });
  }
}

export { ListNationalitiesController };
