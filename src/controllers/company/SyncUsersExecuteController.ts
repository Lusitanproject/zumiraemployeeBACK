import { Request, Response } from "express";

import { SyncCompanyParamsSchema, SyncUsersPayloadSchema } from "../../schemas/user";
import { UserService } from "../../services/user/UserService";

class SyncUsersExecuteController {
  async handle(req: Request, res: Response) {
    const parsedParams = SyncCompanyParamsSchema.parse(req.params);

    const parsedBody = SyncUsersPayloadSchema.parse(req.body);

    const result = await new UserService().executeSync(parsedParams.id, parsedBody.users);
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { SyncUsersExecuteController };
