import { Request, Response } from "express";

import { ActService } from "../../services/act/ActService";

class DeleteActController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;

    const service = new ActService();
    const result = await service.deleteAct({ id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DeleteActController };
