import { Router } from "express";

import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";

import { CreatePsychologicalDimensionController } from "./controllers/psychologicalDimension/CreatePsychologicalDimensionController";

import { CreateQuestionController } from "./controllers/assessmentQuestion/CreateQuestionController";
import { ListAssessmentsController } from "./controllers/assessment/ListAssessmentsController";

import { isAuthenticated } from "./middlewares/isAuthenticated";
import { ListSelfMonitoringBlocksController } from "./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController";

const router = Router();

// ROTAS USER
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);

// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated, new CreatePsychologicalDimensionController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.post("assessments/questions", isAuthenticated, new CreateQuestionController().handle);

// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated, new ListSelfMonitoringBlocksController().handle);

export { router };
