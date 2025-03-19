import { Router } from "express";

import { isAuthenticated } from "./middlewares/isAuthenticated";

import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";
import { CreateUserController } from "./controllers/admin/users/CreateUserController";

import { CreateAssessmentController } from "./controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "./controllers/assessment/CreateQuestionController";
import { ListAssessmentsController } from "./controllers/assessment/ListAssessmentsController";
import { DetailAssessmentController } from "./controllers/assessment/DetailAssessmentController";
import { CreateResultController } from "./controllers/assessment/CreateResultController";

import { ListSelfMonitoringBlocksController } from "./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController";

import { CreateCompanyController } from "./controllers/company/CreateCompanyController";
import { AssessmentDetailForAdminController } from "./controllers/assessment/AssessmentDetailForAdminController";
import { ListUsersByCompanyController } from "./controllers/admin/users/ListUsersByCompanyController";
import { ListAllSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { CreateSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { FindSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { ListAllUsersController } from "./controllers/admin/users/ListAllUsersController";
import { FindUserController } from "./controllers/admin/users/FindUserController";
import { FindAllCompaniesController } from "./controllers/admin/companies/FindAllCompaniesController";
import { FindAllRolesController } from "./controllers/admin/roles/FindAllRolesController";
import { UpdateUserController } from "./controllers/admin/users/UpdateUserController";
import { FindAllDimensionsController } from "./controllers/admin/dimensions/FindAllDimensionController";
import { CreateDimensionController } from "./controllers/admin/dimensions/CreateDimensionController";
import { FindQuestionByAssessmentController } from "./controllers/admin/assessments/FindQuestionByAssessmentController";
import { UpdateAssessmentController } from "./controllers/admin/assessments/UpdateAssessmentController";
import { FindDimensionByBlockController } from "./controllers/admin/dimensions/FindBySelfMonitoringController";
import { FindCompanyController } from "./controllers/admin/companies/FindCompanyController";
import { UpdateFeedbackController } from "./controllers/selfMonitoringBlock/UpdateFeedbackController";
import { DetailFeedbackController } from "./controllers/selfMonitoringBlock/DetailFeedbackController";
import { UpdateQuestionsController } from "./controllers/assessment/UpdateQuestionsController";

const router = Router();

// ROTAS AUTH
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);

// ROTAS USERS
router.post("/users", isAuthenticated, new CreateUserController().handle);
router.put("/users/:id", isAuthenticated, new UpdateUserController().handle);
router.get("/users", isAuthenticated, new ListAllUsersController().handle);
router.get("/users/:userId", isAuthenticated, new FindUserController().handle);
router.get("/users/company/:companyId", isAuthenticated, new ListUsersByCompanyController().handle);

// ROTAS PERFIS
router.get("/roles", isAuthenticated, new FindAllRolesController().handle);

// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated, new CreateDimensionController().handle);
router.get("/dimensions", isAuthenticated, new FindAllDimensionsController().handle);
router.get("/dimensions/:selfMonitoringBlockId", isAuthenticated, new FindDimensionByBlockController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated, new DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated, new AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated, new CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated, new CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated, new CreateResultController().handle);
router.put("/assessments/questions/:id", isAuthenticated, new UpdateQuestionsController().handle);
router.put("/assessments/:id", isAuthenticated, new UpdateAssessmentController().handle);

// ROTAS QUESTIONS
router.get("/questions/:assessmentId", isAuthenticated, new FindQuestionByAssessmentController().handle);

// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated, new ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated, new ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated, new CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated, new EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated, new FindSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/feedback/:id", isAuthenticated, new UpdateFeedbackController().handle);
router.get("/self-monitoring/feedback/:id", isAuthenticated, new DetailFeedbackController().handle);
router.post("/self-monitoring/:id/feedback", isAuthenticated, new UpdateFeedbackController().handle);
router.get("/self-monitoring/:id/feedback", isAuthenticated, new DetailFeedbackController().handle);

// ROTAS COMPANY
router.get("/companies", isAuthenticated, new FindAllCompaniesController().handle);
router.get("/companies/:companyId", isAuthenticated, new FindCompanyController().handle);
router.post("/companies", isAuthenticated, new CreateCompanyController().handle);

export { router };
