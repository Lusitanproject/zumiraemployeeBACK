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
const UpdateFeedbackController_1 = require("./controllers/selfMonitoringBlock/UpdateFeedbackController");
const DetailFeedbackController_1 = require("./controllers/selfMonitoringBlock/DetailFeedbackController");
const FindAllCompaniesController_1 = require("./controllers/admin/companies/FindAllCompaniesController");
const CreateCompanyController_1 = require("./controllers/company/CreateCompanyController");
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
// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.ListAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated_1.isAuthenticated, new AssessmentDetailForAdminController_1.AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated_1.isAuthenticated, new CreateAssessmentController_1.CreateAssessmentController().handle);
router.post("/assessments/questions", isAuthenticated_1.isAuthenticated, new CreateQuestionController_1.CreateQuestionController().handle);
router.post("/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.CreateResultController().handle);
router.put("/assessments/questions/:id", isAuthenticated_1.isAuthenticated, new UpdateQuestionsController_1.UpdateQuestionsController().handle);
router.put("/assessments/:id", isAuthenticated_1.isAuthenticated, new UpdateAssessmentController_1.UpdateAssessmentController().handle);
// ROTAS QUESTIONS
router.get("/questions/:assessmentId", isAuthenticated_1.isAuthenticated, new FindQuestionByAssessmentController_1.FindQuestionByAssessmentController().handle);
// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlocksController_1.ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new FindAllSelfMonitoringBlocksController_1.ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new CreateSelfMonitoringBlockController_1.CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new EditSelfMonitoringBlockController_1.EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new FindSelfMonitoringBlockController_1.FindSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/feedback/:id", isAuthenticated_1.isAuthenticated, new UpdateFeedbackController_1.UpdateFeedbackController().handle);
router.get("/self-monitoring/feedback/:id", isAuthenticated_1.isAuthenticated, new DetailFeedbackController_1.DetailFeedbackController().handle);
// ROTAS COMPANY
router.get("/companies", isAuthenticated_1.isAuthenticated, new FindAllCompaniesController_1.FindAllCompaniesController().handle);
router.post("/companies", isAuthenticated_1.isAuthenticated, new CreateCompanyController_1.CreateCompanyController().handle);
