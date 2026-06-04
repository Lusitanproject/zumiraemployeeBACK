import { Request, Response } from "express";

import { CreateActSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class CreateActController {
  async handle(req: Request, res: Response) {
    const data = CreateActSchema.parse(req.body);

    const service = new ActService();
    const result = await service.create({ ...data, companyId: req.user.companyId! });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActController };
