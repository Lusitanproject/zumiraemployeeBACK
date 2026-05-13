import { Request, Response } from "express";

import { GetActChapterSchema } from "../../../schemas/actChatbot";
import { UserIdSchema } from "../../../schemas/common";
import { ActService } from "../../../services/act/ActService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationGetActChapterController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw Error(parseZodError(userIdError));

    const { success, data, error } = GetActChapterSchema.safeParse(req.query);

    if (!success) throw Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new ActService();
    const result = await service.getChapter({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationGetActChapterController };
