import { Request, Response } from "express";

import { UserIdSchema } from "../../../definitions/common";
import { MoveToNextActService } from "../../../services/act/MoveToNextActService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationMoveToNextActController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;

    const service = new MoveToNextActService();
    const result = await service.execute(userId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationMoveToNextActController };
