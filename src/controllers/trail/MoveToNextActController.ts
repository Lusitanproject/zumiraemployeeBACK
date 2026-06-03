import { Request, Response } from "express";
import { z } from "zod";

import { TrailService } from "../../services/trail/TrailService";

class MoveToNextActController {
  async handle(req: Request, res: Response) {
    const trailId = z.string().cuid().parse(req.params.trailId);
    const service = new TrailService();
    const result = await service.moveToNextAct(req.user.id, trailId);
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { MoveToNextActController };
