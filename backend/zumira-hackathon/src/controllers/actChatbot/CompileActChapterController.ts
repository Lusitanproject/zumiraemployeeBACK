import { Request, Response } from "express";

import { CompileActChapterSchema } from "../../definitions/actChatbot";
import { CompileActChapterService } from "../../services/actChatbot/CompileActChapterService";
import { parseZodError } from "../../utils/parseZodError";

class CompileActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CompileActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new CompileActChapterService();
    const result = await service.execute({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CompileActChapterController };
