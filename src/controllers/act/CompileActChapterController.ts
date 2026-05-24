import { Request, Response } from "express";

import { CompileActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class CompileActChapterController {
  async handle(req: Request, res: Response) {
    const data = CompileActChapterSchema.parse(req.body);

    const service = new ActService();
    const result = await service.compileChapter({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CompileActChapterController };
