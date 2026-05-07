"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const CreateUserController_1 = require("../controllers/user/CreateUserController");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post("/", new CreateUserController_1.CreateUserController().handle);
