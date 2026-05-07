import { Router } from "express";

import { AuthUserController } from "../controllers/user/auth/AuthUserController";
import { SendCodeController } from "../controllers/user/auth/SendCodeController";

const authRouter = Router();

authRouter.post("/email", new SendCodeController().handle);
authRouter.post("/verify", new AuthUserController().handle);

export { authRouter };
