import { Request, Response } from "express";
import { parseZodError } from "../../utils/parseZodError";
import { CreateUserService } from "../../services/user/CreateUserService";
import { CreateUserSchema } from "../../definitions/user";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateUserSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const createUser = new CreateUserService();
    const user = await createUser.execute(data);

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { CreateUserController };
