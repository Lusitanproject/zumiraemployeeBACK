import { Request, Response } from "express";
import { z } from "zod";

import { AuthService } from "../../../services/user/AuthService";
import { AuthUserSchema } from "../../../schemas/user";
class AuthUserController {
  async handle(req: Request, res: Response) {
    const data = AuthUserSchema.parse(req.body);

    const authUser = new AuthService();
    const auth = await authUser.auth(data);

    return res.json({ status: "SUCCESS", data: auth });
  }
}

export { AuthUserController };
