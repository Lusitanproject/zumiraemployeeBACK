import { Request, Response } from "express";
import { CompileActChapterSchema, UpdateActChapterCompilationSchema } from "../../definitions/actChatbot";
import { parseZodError } from "../../utils/parseZodError";
import { CompileActChapterService } from "../../services/actChatbot/CompileActChapterService";
import { UpdateActChapterCompilationService } from "../../services/actChatbot/UpdateActChapterCompilationService";

class UpdateActChapterCompilationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateActChapterCompilationSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new UpdateActChapterCompilationService();
    const result = await service.execute({ ...data, userId: req.user.id });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActChapterCompilationController };
