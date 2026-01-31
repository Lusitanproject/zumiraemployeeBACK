import { Request, Response } from "express";
import { z } from "zod";

import { AuthUserService } from "../../../services/user/auth/AuthUserService";
import { parseZodError } from "../../../utils/parseZodError";
import { AuthUserSchema } from "../../../definitions/user";
class AuthUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = AuthUserSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const authUser = new AuthUserService();
    const auth = await authUser.execute(data);

    return res.json({ status: "SUCCESS", data: auth });
  }
}

export { AuthUserController };
