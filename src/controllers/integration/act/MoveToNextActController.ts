import { Request, Response } from "express";

import { UserIdSchema } from "../../../schemas/common";
import { ActService } from "../../../services/act/ActService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationMoveToNextActController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;

    const service = new ActService();
    const result = await service.moveToNext(userId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationMoveToNextActController };
