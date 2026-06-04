import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class FindOwnedActsController {
  async handle(req: Request, res: Response) {
    const service = new ActService();
    const result = await service.findOwned(req.user.companyId!);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindOwnedActsController };
