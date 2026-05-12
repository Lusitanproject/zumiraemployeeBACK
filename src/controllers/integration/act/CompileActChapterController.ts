import { Request, Response } from "express";

import { CompileActChapterSchema } from "../../../schemas/actChatbot";
import { ActService } from "../../../services/act/ActService";
import { parseZodError } from "../../../utils/parseZodError";
import { UserIdSchema } from "../../../schemas/common";

class IntegrationCompileActChapterController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = CompileActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new ActService();
    const result = await service.compileChapter({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationCompileActChapterController };
