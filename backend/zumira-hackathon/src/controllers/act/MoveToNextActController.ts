import { Request, Response } from "express";

import { MoveToNextActService } from "../../services/act/MoveToNextActService";

class MoveToNextActController {
  async handle(req: Request, res: Response) {
    const service = new MoveToNextActService();
    const result = await service.execute(req.user.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { MoveToNextActController };
