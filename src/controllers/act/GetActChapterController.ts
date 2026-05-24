import { Request, Response } from "express";

import { GetActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class GetActChapterController {
  async handle(req: Request, res: Response) {
    const data = GetActChapterSchema.parse(req.query);

    const service = new ActService();
    const result = await service.getChapter({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetActChapterController };
