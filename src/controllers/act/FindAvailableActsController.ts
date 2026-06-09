import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class FindAvailableActsController {
  async handle(req: Request, res: Response) {
    const service = new ActService();
    const result = await service.findAvailable(req.user.companyId!);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAvailableActsController };
