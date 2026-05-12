import { Request, Response } from "express";

import { CreateUserSchema } from "../../schemas/user";
import { UserService } from "../../services/user/UserService";
import { parseZodError } from "../../utils/parseZodError";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateUserSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const createUser = new UserService();
    const user = await createUser.create(data);

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { CreateUserController };
