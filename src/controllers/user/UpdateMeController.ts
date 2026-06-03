import { Request, Response } from "express";

import { UpdateMeSchema } from "../../schemas/user";
import { UserService } from "../../services/user/UserService";

class UpdateMeController {
  async handle(req: Request, res: Response) {
    const data = UpdateMeSchema.parse(req.body);
    const user = await new UserService().updateMe({ id: req.user.id, ...data });
    return res.json({ status: "SUCCESS", data: user });
  }
}

export { UpdateMeController };
