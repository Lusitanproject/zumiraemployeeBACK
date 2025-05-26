import { Request, Response } from "express";
import { ListResultsService } from "../../services/assessment/ListResultsService";

class ListResultsController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const service = new ListResultsService();
    const results = await service.execute(userId);

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { ListResultsController };
