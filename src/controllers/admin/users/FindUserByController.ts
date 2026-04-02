import { Request, Response } from "express";

import { parseZodError } from "../../../utils/parseZodError";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { FindUserBySchema } from "../../../definitions/admin/users";

class FindUserByController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindUserBySchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new UserAdminService();
    const result = await service.findBy(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindUserByController };
