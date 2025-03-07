import { Request, Response } from "express";
import { SendCodeService } from "../../../services/user/auth/SendCodeService";

class SendCodeController {
    async handle(req: Request, res: Response) {
        const { email } = req.body;

        const sendCode = new SendCodeService();
        const response = await sendCode.execute(email);

        return res.json(response);
    }
}

export { SendCodeController };
