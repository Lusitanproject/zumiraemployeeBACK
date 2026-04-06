import { Router } from "express";

import { CreateUserController } from "../controllers/user/CreateUserController";

const usersRoutes = Router();

usersRoutes.post("/", new CreateUserController().handle);

export { usersRoutes };
