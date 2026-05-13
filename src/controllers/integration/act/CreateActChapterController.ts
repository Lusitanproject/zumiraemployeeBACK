import { Request, Response } from "express";

import { CreateActChapterSchema } from "../../../schemas/actChatbot";
import { UserIdSchema } from "../../../schemas/common";
import { ActService } from "../../../services/act/ActService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationCreateActChapterController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { success, data, error } = CreateActChapterSchema.safeParse(req.body);

    if (!success) throw Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new ActService();
    const result = await service.createChapter({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationCreateActChapterController };
