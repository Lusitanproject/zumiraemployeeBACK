import { Request, Response } from "express";

import { CreateActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

class CreateActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateActChapterSchema.safeParse(req.body);

    if (!success) throw Error(parseZodError(error));

    const service = new ActService();
    const result = await service.createChapter({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActChapterController };
