import { Request, Response } from "express";

import { CompileActChapterSchema } from "../../../definitions/actChatbot";
import { CompileActChapterService } from "../../../services/act/CompileActChapterService";
import { parseZodError } from "../../../utils/parseZodError";
import { UserIdSchema } from "../../../definitions/common";

class IntegrationCompileActChapterController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = CompileActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new CompileActChapterService();
    const result = await service.execute({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationCompileActChapterController };
