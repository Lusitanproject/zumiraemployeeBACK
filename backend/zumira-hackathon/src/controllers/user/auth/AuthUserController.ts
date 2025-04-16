import { Request, Response } from "express";
import { AuthUserService } from "../../../services/user/auth/AuthUserService";
import { z } from "zod";
import { parseZodError } from "../../../utils/parseZodError";

const CreateAuthSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateAuthSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const { email, code } = data;

    const authUser = new AuthUserService();
    const auth = await authUser.execute({ email, code });

    return res.json({ status: "SUCCESS", data: auth });
  }
}

export { AuthUserController };
