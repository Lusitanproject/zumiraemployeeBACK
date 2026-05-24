import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class MoveToNextActController {
  async handle(req: Request, res: Response) {
    const service = new ActService();
    const result = await service.moveToNext(req.user.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { MoveToNextActController };
