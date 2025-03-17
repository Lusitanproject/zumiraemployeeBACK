"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const SendCodeController_1 = require("./controllers/user/auth/SendCodeController");
const AuthUserController_1 = require("./controllers/user/auth/AuthUserController");
const CreateUserController_1 = require("./controllers/user/CreateUserController");
const CreatePsychologicalDimensionController_1 = require("./controllers/psychologicalDimension/CreatePsychologicalDimensionController");
const ListPsychologicalDimensionsController_1 = require("./controllers/psychologicalDimension/ListPsychologicalDimensionsController");
const CreateAssessmentController_1 = require("./controllers/assessment/CreateAssessmentController");
const CreateQuestionController_1 = require("./controllers/assessment/CreateQuestionController");
const ListAssessmentsController_1 = require("./controllers/assessment/ListAssessmentsController");
const DetailAssessmentController_1 = require("./controllers/assessment/DetailAssessmentController");
const CreateResultController_1 = require("./controllers/assessment/CreateResultController");
const ListSelfMonitoringBlocksController_1 = require("./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController");
const ListCompaniesController_1 = require("./controllers/company/ListCompaniesController");
const CreateCompanyController_1 = require("./controllers/company/CreateCompanyController");
const router = (0, express_1.Router)();
exports.router = router;
// ROTAS USER
router.post("/auth/email", new SendCodeController_1.SendCodeController().handle);
router.post("/auth/verify", new AuthUserController_1.AuthUserController().handle);
router.post("/users", isAuthenticated_1.isAuthenticated, new CreateUserController_1.CreateUserController().handle);
// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated_1.isAuthenticated, new CreatePsychologicalDimensionController_1.CreatePsychologicalDimensionController().handle);
router.get("/dimensions", isAuthenticated_1.isAuthenticated, new ListPsychologicalDimensionsController_1.ListPsychologicalDimensionsController().handle);
// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.ListAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.DetailAssessmentController().handle);
router.post("/assessments", isAuthenticated_1.isAuthenticated, new CreateAssessmentController_1.CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated_1.isAuthenticated, new CreateQuestionController_1.CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.CreateResultController().handle);
// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlocksController_1.ListSelfMonitoringBlocksController().handle);
// ROTAS COMPANY
router.get("/companies", isAuthenticated_1.isAuthenticated, new ListCompaniesController_1.ListCompaniesController().handle);
router.post("/companies", isAuthenticated_1.isAuthenticated, new CreateCompanyController_1.CreateCompanyController().handle);
