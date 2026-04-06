import { Request, Response } from "express";

import { UserIdSchema } from "../../../definitions/common";
import { GetFullStoryService } from "../../../services/act/GetFullStoryService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationGetFullStoryController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;

    const service = new GetFullStoryService();
    const result = await service.execute(userId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationGetFullStoryController };
