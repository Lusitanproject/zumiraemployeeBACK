import { Request, Response } from "express";

import { CompileActChapterSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";
import { parseZodError } from "../../utils/parseZodError";

class CompileActChapterController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CompileActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new ActService();
    const result = await service.compileChapter({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CompileActChapterController };
