import { Request, Response } from "express";

import { CreateActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class CreateActChapterController {
  async handle(req: Request, res: Response) {
    const data = CreateActChapterSchema.parse(req.body);

    const service = new ActService();
    const result = await service.createChapter({ userId: req.user.id, type: "REGULAR", ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActChapterController };
