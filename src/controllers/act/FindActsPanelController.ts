import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class FindActsPanelController {
  async handle(req: Request, res: Response) {
    const service = new ActService();
    const result = await service.findForPanel(req.user);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActsPanelController };
