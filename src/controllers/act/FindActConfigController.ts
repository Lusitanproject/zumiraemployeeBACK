import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class FindActConfigController {
  async handle(req: Request, res: Response) {
    const service = new ActService();
    const result = await service.findByIdConfig({ id: req.params.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActConfigController };
