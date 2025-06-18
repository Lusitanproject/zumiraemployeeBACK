import { Request, Response } from "express";

import { UpdateActChapterSchema } from "../../definitions/actChatbot";
import { UpdateActChapterService } from "../../services/actChatbot/UpdateActChapterService";
import { parseZodError } from "../../utils/parseZodError";

class UpdateActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new UpdateActChapterService();
    const result = await service.execute({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActChapterController };
