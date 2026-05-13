import { Request, Response } from "express";

import { FindUserBySchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";
import { parseZodError } from "../../utils/parseZodError";

class FindUserByController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindUserBySchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new UserService();
    const result = await service.findBy(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindUserByController };
