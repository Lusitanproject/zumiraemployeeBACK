import { Router } from "express";

import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";

import { CreatePsychologicalDimensionController } from "./controllers/psychologicalDimension/CreatePsychologicalDimensionController";

import { CreateQuestionController } from "./controllers/assessmentQuestion/CreateQuestionController";

const router = Router();

// ROTAS USER
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);

// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dim/new", new CreatePsychologicalDimensionController().handle);

// ROTAS ASSESSMENT QUESTION
router.post("/question/new", new CreateQuestionController().handle);

export { router };
