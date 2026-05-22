import { Request, Response } from "express";

import { AuthUserSchema } from "../../../schemas/user";
import { AuthService } from "../../../services/user/AuthService";
class AuthUserController {
  async handle(req: Request, res: Response) {
    const data = AuthUserSchema.parse(req.body);

    const authUser = new AuthService();
    const auth = await authUser.auth(data);

    return res.json({ status: "SUCCESS", data: auth });
  }
}

export { AuthUserController };
