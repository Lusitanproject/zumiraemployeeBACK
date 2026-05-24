import { Request, Response } from "express";

import { CreateUserSchema } from "../../schemas/user";
import { UserService } from "../../services/user/UserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const data = CreateUserSchema.parse(req.body);

    const createUser = new UserService();
    const user = await createUser.create(data);

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { CreateUserController };
