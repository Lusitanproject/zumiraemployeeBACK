import { Router } from "express";

import { isAuthenticated } from "./middlewares/isAuthenticated";

import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";
import { CreateUserController } from "./controllers/user/CreateUserController";

import { CreatePsychologicalDimensionController } from "./controllers/psychologicalDimension/CreatePsychologicalDimensionController";
import { ListPsychologicalDimensionsController } from "./controllers/psychologicalDimension/ListPsychologicalDimensionsController";

import { CreateAssessmentController } from "./controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "./controllers/assessment/CreateQuestionController";
import { ListAssessmentsController } from "./controllers/assessment/ListAssessmentsController";
import { DetailAssessmentController } from "./controllers/assessment/DetailAssessmentController";
import { CreateResultController } from "./controllers/assessment/CreateResultController";

import { ListSelfMonitoringBlocksController } from "./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController";

import { ListCompaniesController } from "./controllers/company/ListCompaniesController";
import { CreateCompanyController } from "./controllers/company/CreateCompanyController";

const router = Router();

// ROTAS USER
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);
router.post("/users", isAuthenticated, new CreateUserController().handle);

// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated, new CreatePsychologicalDimensionController().handle);
router.get("/dimensions", isAuthenticated, new ListPsychologicalDimensionsController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated, new DetailAssessmentController().handle);
router.post("/assessments", isAuthenticated, new CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated, new CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated, new CreateResultController().handle);

// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated, new ListSelfMonitoringBlocksController().handle);

// ROTAS COMPANY
router.get("/companies", isAuthenticated, new ListCompaniesController().handle);
router.post("/companies", isAuthenticated, new CreateCompanyController().handle);

export { router };
