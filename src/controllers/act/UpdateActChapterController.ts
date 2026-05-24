import { Request, Response } from "express";

import { UpdateActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class UpdateActChapterController {
  async handle(req: Request, res: Response) {
    const data = UpdateActChapterSchema.parse(req.body);

    const service = new ActService();
    const result = await service.updateChapter({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActChapterController };
