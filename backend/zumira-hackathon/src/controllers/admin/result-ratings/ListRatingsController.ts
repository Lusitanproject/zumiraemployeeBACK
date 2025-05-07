import { Request, Response } from "express";
import { ResultRatingAdminService } from "../../../services/admin/ResultRatingAdminService";

class ListRatingsController {
  async handle(req: Request, res: Response) {
    const service = new ResultRatingAdminService();
    const result = await service.findAll();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListRatingsController };
