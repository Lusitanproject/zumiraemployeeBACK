import { Router } from "express";

import { CreateUserController } from "../controllers/user/CreateUserController";

const userRouter = Router();

userRouter.post("/", new CreateUserController().handle);

export { userRouter };
