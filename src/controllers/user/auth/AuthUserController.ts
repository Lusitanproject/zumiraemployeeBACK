import { Request, Response } from "express";
import { z } from "zod";

import { AuthService } from "../../../services/user/AuthService";
import { parseZodError } from "../../../utils/parseZodError";
import { AuthUserSchema } from "../../../schemas/user";
class AuthUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = AuthUserSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const authUser = new AuthService();
    const auth = await authUser.auth(data);

    return res.json({ status: "SUCCESS", data: auth });
  }
}

export { AuthUserController };
