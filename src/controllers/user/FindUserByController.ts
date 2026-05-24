import { Request, Response } from "express";

import { FindUserBySchema } from "../../schemas/admin/users";
import { UserService } from "../../services/user/UserService";

class FindUserByController {
  async handle(req: Request, res: Response) {
    const data = FindUserBySchema.parse(req.query);

    const service = new UserService();
    const result = await service.findBy(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindUserByController };
