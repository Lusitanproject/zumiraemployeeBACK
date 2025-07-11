import { Request, Response } from "express";

import { GetActChapterSchema } from "../../definitions/actChatbot";
import { GetActChapterService } from "../../services/act/GetActChapterService";
import { parseZodError } from "../../utils/parseZodError";

class GetActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GetActChapterSchema.safeParse(req.query);

    if (!success) throw Error(parseZodError(error));

    const service = new GetActChapterService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetActChapterController };
