import { Request, Response } from "express";

import { CreateActChapterSchema } from "../../definitions/actChatbot";
import { CreateActChapterService } from "../../services/act/CreateActChapterService";
import { parseZodError } from "../../utils/parseZodError";

class CreateActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateActChapterSchema.safeParse(req.body);

    if (!success) throw Error(parseZodError(error));

    const service = new CreateActChapterService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActChapterController };
