import { Request, Response } from "express";

import { GetActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

class GetActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GetActChapterSchema.safeParse(req.query);

    if (!success) throw Error(parseZodError(error));

    const service = new ActService();
    const result = await service.getChapter({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetActChapterController };
