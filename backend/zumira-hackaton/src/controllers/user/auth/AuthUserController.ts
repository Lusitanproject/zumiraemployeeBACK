import { Request, Response } from "express";
import { AuthUserService } from "../../../services/user/auth/AuthUserService";

class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, code } = req.body;

        const authUser = new AuthUserService();
        const auth = await authUser.execute({ email, code });

        return res.json(auth);
    }
}

export { AuthUserController };
