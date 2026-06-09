import { Request, Response } from "express";

import { UpdateActSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class UpdateActController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;
    const data = UpdateActSchema.parse(req.body);

    const service = new ActService();
    const result = await service.update({ id, companyId: req.user.companyId!, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActController };
