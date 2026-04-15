"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const CreateUserController_1 = require("../controllers/user/CreateUserController");
const usersRoutes = (0, express_1.Router)();
exports.usersRoutes = usersRoutes;
usersRoutes.post("/", new CreateUserController_1.CreateUserController().handle);
