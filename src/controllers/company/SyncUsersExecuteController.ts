import { Request, Response } from "express";

import { SyncCompanyParamsSchema, SyncUsersPayloadSchema } from "../../schemas/user";
import { UserService } from "../../services/user/UserService";
import { parseZodError } from "../../utils/parseZodError";

class SyncUsersExecuteController {
  async handle(req: Request, res: Response) {
    const parsedParams = SyncCompanyParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(parsedParams.error) });
    }

    const parsedBody = SyncUsersPayloadSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(parsedBody.error) });
    }

    const result = await new UserService().executeSync(parsedParams.data.id, parsedBody.data.users);
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SyncUsersExecuteController };
