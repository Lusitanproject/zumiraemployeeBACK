"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const SendCodeController_1 = require("./controllers/user/auth/SendCodeController");
const AuthUserController_1 = require("./controllers/user/auth/AuthUserController");
const CreateUserController_1 = require("./controllers/admin/users/CreateUserController");
const ListUsersByCompanyController_1 = require("./controllers/admin/users/ListUsersByCompanyController");
const ListAllUsersController_1 = require("./controllers/admin/users/ListAllUsersController");
const FindUserController_1 = require("./controllers/admin/users/FindUserController");
const UpdateUserController_1 = require("./controllers/admin/users/UpdateUserController");
const FindAllRolesController_1 = require("./controllers/admin/roles/FindAllRolesController");
const FindAllDimensionController_1 = require("./controllers/admin/dimensions/FindAllDimensionController");
const CreateDimensionController_1 = require("./controllers/admin/dimensions/CreateDimensionController");
const CreateAssessmentController_1 = require("./controllers/assessment/CreateAssessmentController");
const CreateQuestionController_1 = require("./controllers/assessment/CreateQuestionController");
const ListAssessmentsController_1 = require("./controllers/assessment/ListAssessmentsController");
const DetailAssessmentController_1 = require("./controllers/assessment/DetailAssessmentController");
const CreateResultController_1 = require("./controllers/assessment/CreateResultController");
const AssessmentDetailForAdminController_1 = require("./controllers/assessment/AssessmentDetailForAdminController");
const UpdateAssessmentController_1 = require("./controllers/admin/assessments/UpdateAssessmentController");
const UpdateQuestionsController_1 = require("./controllers/assessment/UpdateQuestionsController");
const FindQuestionByAssessmentController_1 = require("./controllers/admin/assessments/FindQuestionByAssessmentController");
const ListSelfMonitoringBlocksController_1 = require("./controllers/selfMonitoringBlock/ListSelfMonitoringBlocksController");
const FindAllSelfMonitoringBlocksController_1 = require("./controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController");
const CreateSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/CreateSelfMonitoringBlockController");
const EditSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/EditSelfMonitoringBlockController");
const FindSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/FindSelfMonitoringBlockController");
const GenerateUserFeedbackController_1 = require("./controllers/assessment/GenerateUserFeedbackController");
const DetailUserFeedbackController_1 = require("./controllers/selfMonitoringBlock/DetailUserFeedbackController");
const FindAllCompaniesController_1 = require("./controllers/admin/companies/FindAllCompaniesController");
const CreateCompanyController_1 = require("./controllers/company/CreateCompanyController");
const FindBySelfMonitoringController_1 = require("./controllers/admin/dimensions/FindBySelfMonitoringController");
const FindCompanyController_1 = require("./controllers/admin/companies/FindCompanyController");
const ListFeedbacksController_1 = require("./controllers/assessment/feedback/ListFeedbacksController");
const FindDimensionController_1 = require("./controllers/admin/dimensions/FindDimensionController");
const EditDimensionController_1 = require("./controllers/admin/dimensions/EditDimensionController");
const ListNationalitiesController_1 = require("./controllers/nationality/ListNationalitiesController");
const ListNotificationsController_1 = require("./controllers/notification/ListNotificationsController");
const ReadNotificationController_1 = require("./controllers/notification/ReadNotificationController");
const DetailNotificationController_1 = require("./controllers/notification/DetailNotificationController");
const CreateNotificationController_1 = require("./controllers/admin/notifications/CreateNotificationController");
const UpdateNotificationController_1 = require("./controllers/admin/notifications/UpdateNotificationController");
const DeleteNotificationController_1 = require("./controllers/admin/notifications/DeleteNotificationController");
const FindAllNotificationsController_1 = require("./controllers/admin/notifications/FindAllNotificationsController");
const FindAllTypesController_1 = require("./controllers/admin/notifications/FindAllTypesController");
const FindAllFeedbacksController_1 = require("./controllers/admin/companies/FindAllFeedbacksController");
const router = (0, express_1.Router)();
exports.router = router;
// ROTAS AUTH
router.post("/auth/email", new SendCodeController_1.SendCodeController().handle);
router.post("/auth/verify", new AuthUserController_1.AuthUserController().handle);
// ROTAS USERS
router.post("/users", isAuthenticated_1.isAuthenticated, new CreateUserController_1.CreateUserController().handle);
router.put("/users/:id", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
router.get("/users", isAuthenticated_1.isAuthenticated, new ListAllUsersController_1.ListAllUsersController().handle);
router.get("/users/:userId", isAuthenticated_1.isAuthenticated, new FindUserController_1.FindUserController().handle);
router.get("/users/company/:companyId", isAuthenticated_1.isAuthenticated, new ListUsersByCompanyController_1.ListUsersByCompanyController().handle);
// ROTAS PERFIS
router.get("/roles", isAuthenticated_1.isAuthenticated, new FindAllRolesController_1.FindAllRolesController().handle);
// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated_1.isAuthenticated, new CreateDimensionController_1.CreateDimensionController().handle);
router.get("/dimensions", isAuthenticated_1.isAuthenticated, new FindAllDimensionController_1.FindAllDimensionsController().handle);
router.get("/dimensions/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new FindDimensionController_1.FindDimensionController().handle);
router.put("/dimensions/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new EditDimensionController_1.EditDimensionController().handle);
// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.ListAssessmentsController().handle);
router.get("/assessments/feedback", isAuthenticated_1.isAuthenticated, new ListFeedbacksController_1.ListFeedbacksController().handle);
router.get("/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated_1.isAuthenticated, new AssessmentDetailForAdminController_1.AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated_1.isAuthenticated, new CreateAssessmentController_1.CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated_1.isAuthenticated, new CreateQuestionController_1.CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.CreateResultController().handle);
router.put("/assessments/questions/:id", isAuthenticated_1.isAuthenticated, new UpdateQuestionsController_1.UpdateQuestionsController().handle);
router.put("/assessments/:id", isAuthenticated_1.isAuthenticated, new UpdateAssessmentController_1.UpdateAssessmentController().handle);
router.post("/assessments/feedback/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_1.GenerateUserFeedbackController().handle);
// ROTAS QUESTIONS
router.get("/questions/:assessmentId", isAuthenticated_1.isAuthenticated, new FindQuestionByAssessmentController_1.FindQuestionByAssessmentController().handle);
// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlocksController_1.ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new FindAllSelfMonitoringBlocksController_1.ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new CreateSelfMonitoringBlockController_1.CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new EditSelfMonitoringBlockController_1.EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new FindSelfMonitoringBlockController_1.FindSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/feedback/:id", isAuthenticated_1.isAuthenticated, new DetailUserFeedbackController_1.DetailUserFeedbackController().handle);
router.get("/self-monitoring/dimensions/:selfMonitoringBlockId", isAuthenticated_1.isAuthenticated, new FindBySelfMonitoringController_1.FindDimensionByBlockController().handle);
// ROTAS COMPANY
router.get("/companies", isAuthenticated_1.isAuthenticated, new FindAllCompaniesController_1.FindAllCompaniesController().handle);
router.get("companies/feedbacks/:companyId", isAuthenticated_1.isAuthenticated, new FindAllFeedbacksController_1.FindAllFeedbacksController().handle);
router.get("/companies/:companyId", isAuthenticated_1.isAuthenticated, new FindCompanyController_1.FindCompanyController().handle);
router.post("/companies", isAuthenticated_1.isAuthenticated, new CreateCompanyController_1.CreateCompanyController().handle);
// ROTAS NATIONALITY
router.get("/nationalities", isAuthenticated_1.isAuthenticated, new ListNationalitiesController_1.ListNationalitiesController().handle);
// ROTAS NOTIFICATION
router.get("/notifications", isAuthenticated_1.isAuthenticated, new ListNotificationsController_1.ListNotificationsController().handle);
router.get("/notifications/admin", isAuthenticated_1.isAuthenticated, new FindAllNotificationsController_1.FindAllNotificationsController().handle);
router.get("/notifications/admin/types", isAuthenticated_1.isAuthenticated, new FindAllTypesController_1.FindAllTypesController().handle);
router.get("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new DetailNotificationController_1.DetailNotificationController().handle);
router.put("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new UpdateNotificationController_1.UpdateNotificationController().handle);
router.put("/notifications/:notificationId/read", isAuthenticated_1.isAuthenticated, new ReadNotificationController_1.ReadNotificationController().handle);
router.post("/notifications", isAuthenticated_1.isAuthenticated, new CreateNotificationController_1.CreateNotificationController().handle);
router.delete("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new DeleteNotificationController_1.DeleteNotificationController().handle);
