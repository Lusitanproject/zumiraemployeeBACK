import { Request, Response } from "express";
import { z } from "zod";

import { AuthService } from "../../../services/user/AuthService";
import { parseZodError } from "../../../utils/parseZodError";

const CreateCodeSchema = z.object({
  email: z.string().email(),
});

class SendCodeController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateCodeSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const { email } = data;
    const sendCode = new AuthService();
    const response = await sendCode.sendCode(email);

    return res.json({ status: "SUCCESS", data: response });
  }
}

export { SendCodeController };
