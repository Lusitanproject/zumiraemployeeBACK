import { Request, Response } from "express";

import { ListAlertsService } from "../../services/alert/ListAlertsService";

class ListAlertsController {
  async handle(req: Request, res: Response) {
    const service = new ListAlertsService();
    const result = await service.execute(req.user.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListAlertsController };
