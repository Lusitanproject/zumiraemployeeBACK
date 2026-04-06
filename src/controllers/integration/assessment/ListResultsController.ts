import { Request, Response } from "express";

import { UserIdSchema } from "../../../definitions/common";
import { ListResultsService } from "../../../services/assessment/ListResultsService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationListResultsController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw new Error(parseZodError(userIdError));

    const { userId } = userIdData;

    const service = new ListResultsService();
    const results = await service.execute(userId);

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { IntegrationListResultsController };
