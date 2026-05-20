import { Request, Response } from "express";

import { ListAlertsSchema } from "../../schemas/alert";
import { AlertService } from "../../services/alert/AlertService";

class ListAlertsController {
  async handle(req: Request, res: Response) {
    const data = ListAlertsSchema.parse(req.query);

    const service = new AlertService();
    const result = await service.list({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListAlertsController };
