import { Request, Response } from "express";
import { SendCodeService } from "../../../services/user/auth/SendCodeService";
import { z } from "zod";

const CreateCodeSchema = z.object({
  email: z.string().email(),
});

class SendCodeController {
  async handle(req: Request, res: Response) {
    const { success, data } = CreateCodeSchema.safeParse(req.body);
    try {
      if (!success) {
        return res.status(400).json({
          status: "ERROR",
          message: "Email inválido",
        });
      }

      const { email } = data;
      const sendCode = new SendCodeService();
      const response = await sendCode.execute(email);
      return res.json({ status: "SUCCESS", data: response });
    } catch {
      return res.status(500).json({
        status: "ERROR",
        message: "Erro interno",
      });
    }
  }
}

export { SendCodeController };
