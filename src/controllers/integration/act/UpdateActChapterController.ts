import { Request, Response } from "express";

import { UpdateActChapterSchema } from "../../../definitions/actChatbot";
import { UserIdSchema } from "../../../definitions/common";
import { UpdateActChapterService } from "../../../services/act/UpdateActChapterService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationUpdateActChapterController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = UpdateActChapterSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new UpdateActChapterService();
    const result = await service.execute({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationUpdateActChapterController };
