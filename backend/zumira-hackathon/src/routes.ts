import { Router } from "express";

import { isAuthenticated } from "./middlewares/isAuthenticated";

import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";

import { CreateUserController } from "./controllers/admin/users/CreateUserController";
import { ListUsersByCompanyController } from "./controllers/admin/users/ListUsersByCompanyController";
import { ListAllUsersController } from "./controllers/admin/users/ListAllUsersController";
import { FindUserController } from "./controllers/admin/users/FindUserController";
import { UpdateUserController } from "./controllers/admin/users/UpdateUserController";

import { FindAllRolesController } from "./controllers/admin/roles/FindAllRolesController";

import { FindAllDimensionsController } from "./controllers/admin/dimensions/FindAllDimensionController";
import { CreateDimensionController } from "./controllers/admin/dimensions/CreateDimensionController";

import { CreateAssessmentController } from "./controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "./controllers/assessment/CreateQuestionController";
import { ListAssessmentsController } from "./controllers/assessment/ListAssessmentsController";
import { DetailAssessmentController } from "./controllers/assessment/DetailAssessmentController";
import { CreateResultController } from "./controllers/assessment/CreateResultController";
import { AssessmentDetailForAdminController } from "./controllers/assessment/AssessmentDetailForAdminController";
import { UpdateAssessmentController } from "./controllers/admin/assessments/UpdateAssessmentController";
import { UpdateQuestionsController } from "./controllers/assessment/UpdateQuestionsController";

import { FindQuestionByAssessmentController } from "./controllers/admin/assessments/FindQuestionByAssessmentController";

import { ListSelfMonitoringBlocksController } from "./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController";
import { ListAllSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { CreateSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { FindSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { GenerateUserFeedbackController } from "./controllers/assessment/GenerateUserFeedbackController";
import { GenerateCompanyFeedbackController } from "./controllers/assessment/GenerateCompanyFeedbackController";
import { DetailUserFeedbackController } from "./controllers/selfMonitoringBlock/DetailUserFeedbackController";

import { FindAllCompaniesController } from "./controllers/admin/companies/FindAllCompaniesController";
import { CreateCompanyController } from "./controllers/company/CreateCompanyController";
import { FindDimensionByBlockController } from "./controllers/admin/dimensions/FindBySelfMonitoringController";
import { FindCompanyController } from "./controllers/admin/companies/FindCompanyController";
import { ListFeedbacksController } from "./controllers/assessment/feedback/ListFeedbacksController";
import { FindDimensionController } from "./controllers/admin/dimensions/FindDimensionController";
import { EditDimensionController } from "./controllers/admin/dimensions/EditDimensionController";

import { ListNationalitiesController } from "./controllers/nationality/ListNationalitiesController";

import { ListNotificationsController } from "./controllers/notification/ListNotificationsController";
import { ReadNotificationController } from "./controllers/notification/ReadNotificationController";
import { DetailNotificationController } from "./controllers/notification/DetailNotificationController";
import { CreateNotificationController } from "./controllers/admin/notifications/CreateNotificationController";
import { UpdateNotificationController } from "./controllers/admin/notifications/UpdateNotificationController";
import { DeleteNotificationController } from "./controllers/admin/notifications/DeleteNotificationController";
import { FindAllNotificationsController } from "./controllers/admin/notifications/FindAllNotificationsController";
import { FindAllTypesController } from "./controllers/admin/notifications/FindAllTypesController";
import { FindAllFeedbacksController } from "./controllers/admin/companies/FindAllFeedbacksController";

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
router.get("/dimensions/:psychologicalDimensionId", isAuthenticated, new FindDimensionController().handle);
router.put("/dimensions/:psychologicalDimensionId", isAuthenticated, new EditDimensionController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.get("/assessments/feedback", isAuthenticated, new ListFeedbacksController().handle);
router.get("/assessments/:id", isAuthenticated, new DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated, new AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated, new CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated, new CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated, new CreateResultController().handle);
router.put("/assessments/questions/:id", isAuthenticated, new UpdateQuestionsController().handle);
router.put("/assessments/:id", isAuthenticated, new UpdateAssessmentController().handle);
router.post("/assessments/feedback/users/:id", isAuthenticated, new GenerateUserFeedbackController().handle);
router.post("/assessments/feedback/companies/:id", isAuthenticated, new GenerateCompanyFeedbackController().handle);

// ROTAS QUESTIONS
router.get("/questions/:assessmentId", isAuthenticated, new FindQuestionByAssessmentController().handle);

// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated, new ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated, new ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated, new CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated, new EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated, new FindSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/feedback/:id", isAuthenticated, new DetailUserFeedbackController().handle);
router.get(
  "/self-monitoring/dimensions/:selfMonitoringBlockId",
  isAuthenticated,
  new FindDimensionByBlockController().handle
);

// ROTAS COMPANY
router.get("/companies", isAuthenticated, new FindAllCompaniesController().handle);
router.get("/companies/feedback", isAuthenticated, new FindAllFeedbacksController().handle);
router.get("/companies/:companyId", isAuthenticated, new FindCompanyController().handle);
router.post("/companies", isAuthenticated, new CreateCompanyController().handle);

// ROTAS NATIONALITY
router.get("/nationalities", isAuthenticated, new ListNationalitiesController().handle);

// ROTAS NOTIFICATION
router.get("/notifications", isAuthenticated, new ListNotificationsController().handle);
router.get("/notifications/admin", isAuthenticated, new FindAllNotificationsController().handle);
router.get("/notifications/admin/types", isAuthenticated, new FindAllTypesController().handle);
router.get("/notifications/:notificationId", isAuthenticated, new DetailNotificationController().handle);
router.put("/notifications/:notificationId", isAuthenticated, new UpdateNotificationController().handle);
router.put("/notifications/:notificationId/read", isAuthenticated, new ReadNotificationController().handle);
router.post("/notifications", isAuthenticated, new CreateNotificationController().handle);
router.delete("/notifications/:notificationId", isAuthenticated, new DeleteNotificationController().handle);

export { router };
