import { Router } from "express";

import { AuthUserController } from "../controllers/user/auth/AuthUserController";
import { SendCodeController } from "../controllers/user/auth/SendCodeController";

const authRoutes = Router();

authRoutes.post("/email", new SendCodeController().handle);
authRoutes.post("/verify", new AuthUserController().handle);

export { authRoutes };
