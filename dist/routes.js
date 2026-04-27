"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const CompileActChapterController_1 = require("./controllers/act/CompileActChapterController");
const CreateActChapterController_1 = require("./controllers/act/CreateActChapterController");
const GetActChapterController_1 = require("./controllers/act/GetActChapterController");
const GetActsDataController_1 = require("./controllers/act/GetActsDataController");
const GetFullStoryController_1 = require("./controllers/act/GetFullStoryController");
const MessageActChatbotController_1 = require("./controllers/act/MessageActChatbotController");
const MoveToNextActController_1 = require("./controllers/act/MoveToNextActController");
const UpdateActChapterController_1 = require("./controllers/act/UpdateActChapterController");
const CreateActChatbotController_1 = require("./controllers/admin/acts/CreateActChatbotController");
const FindActChatbotController_1 = require("./controllers/admin/acts/FindActChatbotController");
const FindAllActChatbotsController_1 = require("./controllers/admin/acts/FindAllActChatbotsController");
const FindByTrailController_1 = require("./controllers/admin/acts/FindByTrailController");
const UpdateActChatbotController_1 = require("./controllers/admin/acts/UpdateActChatbotController");
const UpdateManyActChatbotsController_1 = require("./controllers/admin/acts/UpdateManyActChatbotsController");
const DuplicateAssessmentController_1 = require("./controllers/admin/assessments/DuplicateAssessmentController");
const FindAllAssessmentsController_1 = require("./controllers/admin/assessments/FindAllAssessmentsController");
const FindQuestionByAssessmentController_1 = require("./controllers/admin/assessments/FindQuestionByAssessmentController");
const FindResultRatingsByAssessmentController_1 = require("./controllers/admin/assessments/FindResultRatingsByAssessmentController");
const FindResultsFilteredController_1 = require("./controllers/admin/assessments/FindResultsFilteredController");
const GenerateExcelReportController_1 = require("./controllers/admin/assessments/GenerateExcelReportController");
const UpdateAssessmentController_1 = require("./controllers/admin/assessments/UpdateAssessmentController");
const UpdateResultRatingsController_1 = require("./controllers/admin/assessments/UpdateResultRatingsController");
const CreateCompanyController_1 = require("./controllers/admin/companies/CreateCompanyController");
const FindAllCompaniesController_1 = require("./controllers/admin/companies/FindAllCompaniesController");
const FindAllFeedbacksController_1 = require("./controllers/admin/companies/FindAllFeedbacksController");
const FindCompanyController_1 = require("./controllers/admin/companies/FindCompanyController");
const SetCompanyAssessmentsController_1 = require("./controllers/admin/companies/SetCompanyAssessmentsController");
const UpdateCompanyController_1 = require("./controllers/admin/companies/UpdateCompanyController");
const CreateDimensionController_1 = require("./controllers/admin/dimensions/CreateDimensionController");
const EditDimensionController_1 = require("./controllers/admin/dimensions/EditDimensionController");
const FindAllDimensionController_1 = require("./controllers/admin/dimensions/FindAllDimensionController");
const FindBySelfMonitoringController_1 = require("./controllers/admin/dimensions/FindBySelfMonitoringController");
const FindDimensionController_1 = require("./controllers/admin/dimensions/FindDimensionController");
const CreateNationalityController_1 = require("./controllers/admin/nationalities/CreateNationalityController");
const FindAllNationalitiesController_1 = require("./controllers/admin/nationalities/FindAllNationalitiesController");
const FindNationalityController_1 = require("./controllers/admin/nationalities/FindNationalityController");
const UpdateNationalityController_1 = require("./controllers/admin/nationalities/UpdateNationalityController");
const CreateNotificationController_1 = require("./controllers/admin/notifications/CreateNotificationController");
const CreateNotificationTypeController_1 = require("./controllers/admin/notifications/CreateNotificationTypeController");
const DeleteNotificationController_1 = require("./controllers/admin/notifications/DeleteNotificationController");
const FindAllNotificationsController_1 = require("./controllers/admin/notifications/FindAllNotificationsController");
const FindAllTypesController_1 = require("./controllers/admin/notifications/FindAllTypesController");
const FindNotificationTypeController_1 = require("./controllers/admin/notifications/FindNotificationTypeController");
const UpdateNotificationController_1 = require("./controllers/admin/notifications/UpdateNotificationController");
const UpdateNotificationTypeController_1 = require("./controllers/admin/notifications/UpdateNotificationTypeController");
const FindAllRolesController_1 = require("./controllers/admin/roles/FindAllRolesController");
const CreateSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/CreateSelfMonitoringBlockController");
const EditSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/EditSelfMonitoringBlockController");
const FindAllSelfMonitoringBlocksController_1 = require("./controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController");
const FindSelfMonitoringBlockController_1 = require("./controllers/admin/self-monitoring/FindSelfMonitoringBlockController");
const CreateTrailController_copy_1 = require("./controllers/admin/trails/CreateTrailController copy");
const FindAllTrailsController_1 = require("./controllers/admin/trails/FindAllTrailsController");
const FindTrailController_1 = require("./controllers/admin/trails/FindTrailController");
const UpdateTrailController_1 = require("./controllers/admin/trails/UpdateTrailController");
const CreateUserController_1 = require("./controllers/admin/users/CreateUserController");
const DeleteUserController_1 = require("./controllers/admin/users/DeleteUserController");
const FindUserController_1 = require("./controllers/admin/users/FindUserController");
const ListAllUsersController_1 = require("./controllers/admin/users/ListAllUsersController");
const ListUsersByCompanyController_1 = require("./controllers/admin/users/ListUsersByCompanyController");
const UpdateUserController_1 = require("./controllers/admin/users/UpdateUserController");
const ListAlertsController_1 = require("./controllers/alert/ListAlertsController");
const ReadAlertController_1 = require("./controllers/alert/ReadAlertController");
const AssessmentDetailForAdminController_1 = require("./controllers/assessment/AssessmentDetailForAdminController");
const CreateAssessmentController_1 = require("./controllers/assessment/CreateAssessmentController");
const CreateQuestionController_1 = require("./controllers/assessment/CreateQuestionController");
const CreateResultController_1 = require("./controllers/assessment/CreateResultController");
const DetailAssessmentController_1 = require("./controllers/assessment/DetailAssessmentController");
const DetailResultController_1 = require("./controllers/assessment/DetailResultController");
const GenerateCompanyFeedbackController_1 = require("./controllers/assessment/GenerateCompanyFeedbackController");
const GenerateUserFeedbackController_1 = require("./controllers/assessment/GenerateUserFeedbackController");
const ListAssessmentsController_1 = require("./controllers/assessment/ListAssessmentsController");
const ListCompanyAssessmentsController_1 = require("./controllers/assessment/ListCompanyAssessmentsController");
const ListResultsController_1 = require("./controllers/assessment/ListResultsController");
const UpdateQuestionsController_1 = require("./controllers/assessment/UpdateQuestionsController");
const FindCompanyFeedbackController_1 = require("./controllers/company/FindCompanyFeedbackController");
const ListNationalitiesController_1 = require("./controllers/nationality/ListNationalitiesController");
const DetailNotificationController_1 = require("./controllers/notification/DetailNotificationController");
const ListNotificationsController_1 = require("./controllers/notification/ListNotificationsController");
const ReadNotificationController_1 = require("./controllers/notification/ReadNotificationController");
const ListSelfMonitoringBlockResultsController_1 = require("./controllers/self-monitoring-block/ListSelfMonitoringBlockResultsController");
const ListSelfMonitoringBlocksController_1 = require("./controllers/self-monitoring-block/ListSelfMonitoringBlocksController");
const CompileActChapterController_2 = require("./controllers/integration/act/CompileActChapterController");
const CreateActChapterController_2 = require("./controllers/integration/act/CreateActChapterController");
const GetActChapterController_2 = require("./controllers/integration/act/GetActChapterController");
const GetActsDataController_2 = require("./controllers/integration/act/GetActsDataController");
const GetFullStoryController_2 = require("./controllers/integration/act/GetFullStoryController");
const MessageActChatbotController_2 = require("./controllers/integration/act/MessageActChatbotController");
const MoveToNextActController_2 = require("./controllers/integration/act/MoveToNextActController");
const UpdateActChapterController_2 = require("./controllers/integration/act/UpdateActChapterController");
const CreateResultController_2 = require("./controllers/integration/assessment/CreateResultController");
const DetailAssessmentController_2 = require("./controllers/integration/assessment/DetailAssessmentController");
const DetailResultController_2 = require("./controllers/integration/assessment/DetailResultController");
const GenerateCompanyFeedbackController_2 = require("./controllers/integration/assessment/GenerateCompanyFeedbackController");
const GenerateUserFeedbackController_2 = require("./controllers/integration/assessment/GenerateUserFeedbackController");
const ListAssessmentsController_2 = require("./controllers/integration/assessment/ListAssessmentsController");
const ListResultsController_2 = require("./controllers/integration/assessment/ListResultsController");
const AuthUserController_1 = require("./controllers/user/auth/AuthUserController");
const SendCodeController_1 = require("./controllers/user/auth/SendCodeController");
const CreateUserController_2 = require("./controllers/user/CreateUserController");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const FindUserByController_1 = require("./controllers/admin/users/FindUserByController");
const CreateManyUsersController_1 = require("./controllers/admin/users/CreateManyUsersController");
const router = (0, express_1.Router)();
exports.router = router;
// ROTAS AUTH
router.post("/auth/email", new SendCodeController_1.SendCodeController().handle);
router.post("/auth/verify", new AuthUserController_1.AuthUserController().handle);
// ROTAS USERS
router.post("/users", new CreateUserController_2.CreateUserController().handle);
router.post("/users/admin", isAuthenticated_1.isAuthenticated, new CreateUserController_1.CreateUserController().handle);
router.get("/users/admin/find-by", isAuthenticated_1.isAuthenticated, new FindUserByController_1.FindUserByController().handle);
router.put("/users/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
router.delete("/users/:id", isAuthenticated_1.isAuthenticated, new DeleteUserController_1.DeleteUserController().handle);
router.get("/users", isAuthenticated_1.isAuthenticated, new ListAllUsersController_1.ListAllUsersController().handle);
router.get("/users/:userId", isAuthenticated_1.isAuthenticated, new FindUserController_1.FindUserController().handle);
router.get("/users/company/:companyId", isAuthenticated_1.isAuthenticated, new ListUsersByCompanyController_1.ListUsersByCompanyController().handle);
router.post("/users/admin/create-many", isAuthenticated_1.isAuthenticated, new CreateManyUsersController_1.CreateManyUsersController().handle);
// ROTAS PERFIS
router.get("/roles", isAuthenticated_1.isAuthenticated, new FindAllRolesController_1.FindAllRolesController().handle);
// ROTAS PSYCHOLOGICAL DIMENSION
router.post("/dimensions", isAuthenticated_1.isAuthenticated, new CreateDimensionController_1.CreateDimensionController().handle);
router.get("/dimensions", isAuthenticated_1.isAuthenticated, new FindAllDimensionController_1.FindAllDimensionsController().handle);
router.get("/dimensions/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new FindDimensionController_1.FindDimensionController().handle);
router.put("/dimensions/:psychologicalDimensionId", isAuthenticated_1.isAuthenticated, new EditDimensionController_1.EditDimensionController().handle);
// ROTAS RESULTS
router.get("/assessments/results", isAuthenticated_1.isAuthenticated, new ListResultsController_1.ListResultsController().handle);
router.get("/assessments/results/admin", isAuthenticated_1.isAuthenticated, new FindResultsFilteredController_1.FindResultsFilteredController().handle);
router.get("/assessments/results/admin/download-report", isAuthenticated_1.isAuthenticated, new GenerateExcelReportController_1.GenerateExcelReportController().handle);
router.get("/assessments/results/:id", isAuthenticated_1.isAuthenticated, new DetailResultController_1.DetailResultController().handle);
router.post("/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_1.CreateResultController().handle);
// ROTAS QUESTIONS
router.post("/assessments/questions", isAuthenticated_1.isAuthenticated, new CreateQuestionController_1.CreateQuestionController().handle);
router.put("/assessments/questions/:id", isAuthenticated_1.isAuthenticated, new UpdateQuestionsController_1.UpdateQuestionsController().handle);
router.get("/assessments/questions/:assessmentId", isAuthenticated_1.isAuthenticated, new FindQuestionByAssessmentController_1.FindQuestionByAssessmentController().handle);
// ROTAS RESULT RATINGS
router.get("/assessments/ratings/:id", isAuthenticated_1.isAuthenticated, new FindResultRatingsByAssessmentController_1.FindResultRatingsByAssessmentController().handle);
router.put("/assessments/ratings/:id", isAuthenticated_1.isAuthenticated, new UpdateResultRatingsController_1.UpdateResultRatingsController().handle);
// ROTAS ALERTS
router.get("/assessments/alerts", isAuthenticated_1.isAuthenticated, new ListAlertsController_1.ListAlertsController().handle);
router.put("/assessments/alerts/:id/read", isAuthenticated_1.isAuthenticated, new ReadAlertController_1.ReadAlertController().handle);
// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_1.ListAssessmentsController().handle);
router.get("/assessments/company", isAuthenticated_1.isAuthenticated, new ListCompanyAssessmentsController_1.ListCompanyAssessmentsController().handle);
router.get("/assessments/admin", isAuthenticated_1.isAuthenticated, new FindAllAssessmentsController_1.FindAllAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_1.DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated_1.isAuthenticated, new AssessmentDetailForAdminController_1.AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated_1.isAuthenticated, new CreateAssessmentController_1.CreateAssessmentController().handle);
router.post("/assessments/admin/duplicate/:id", isAuthenticated_1.isAuthenticated, new DuplicateAssessmentController_1.DuplicateAssessmentController().handle);
router.post("/assessments/feedback/users/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_1.GenerateUserFeedbackController().handle);
router.post("/assessments/feedback/companies/:id", isAuthenticated_1.isAuthenticated, new GenerateCompanyFeedbackController_1.GenerateCompanyFeedbackController().handle);
router.put("/assessments/:id", isAuthenticated_1.isAuthenticated, new UpdateAssessmentController_1.UpdateAssessmentController().handle);
// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlocksController_1.ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new FindAllSelfMonitoringBlocksController_1.ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated_1.isAuthenticated, new CreateSelfMonitoringBlockController_1.CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new EditSelfMonitoringBlockController_1.EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated_1.isAuthenticated, new FindSelfMonitoringBlockController_1.FindSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/results/:selfMonitoringBlockId", isAuthenticated_1.isAuthenticated, new ListSelfMonitoringBlockResultsController_1.ListSelfMonitoringBlockResultsController().handle);
router.get("/self-monitoring/dimensions/:selfMonitoringBlockId", isAuthenticated_1.isAuthenticated, new FindBySelfMonitoringController_1.FindDimensionByBlockController().handle);
// ROTAS COMPANY
router.get("/companies", isAuthenticated_1.isAuthenticated, new FindAllCompaniesController_1.FindAllCompaniesController().handle);
router.get("/companies/feedback", isAuthenticated_1.isAuthenticated, new FindAllFeedbacksController_1.FindAllFeedbacksController().handle);
router.get("/companies/:companyId", isAuthenticated_1.isAuthenticated, new FindCompanyController_1.FindCompanyController().handle);
router.get("/companies/:id/feedback", isAuthenticated_1.isAuthenticated, new FindCompanyFeedbackController_1.FindCompanyFeedbackController().handle);
router.post("/companies/:id/assessments", isAuthenticated_1.isAuthenticated, new SetCompanyAssessmentsController_1.SetCompanyAssessmentsController().handle);
router.post("/companies/admin", isAuthenticated_1.isAuthenticated, new CreateCompanyController_1.CreateCompanyController().handle);
router.put("/companies/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateCompanyController_1.UpdateCompanyController().handle);
// ROTAS NATIONALITY
router.get("/nationalities", new ListNationalitiesController_1.ListNationalitiesController().handle);
router.post("/nationalities/admin", isAuthenticated_1.isAuthenticated, new CreateNationalityController_1.CreateNationalityController().handle);
router.get("/nationalities/admin", isAuthenticated_1.isAuthenticated, new FindAllNationalitiesController_1.FindAllNationalitiesController().handle);
router.get("/nationalities/admin/:id", isAuthenticated_1.isAuthenticated, new FindNationalityController_1.FindNationalityController().handle);
router.put("/nationalities/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateNationalityController_1.UpdateNationalityController().handle);
// ROTAS NOTIFICATION
router.get("/notifications", isAuthenticated_1.isAuthenticated, new ListNotificationsController_1.ListNotificationsController().handle);
router.get("/notifications/admin", isAuthenticated_1.isAuthenticated, new FindAllNotificationsController_1.FindAllNotificationsController().handle);
router.get("/notifications/admin/types", isAuthenticated_1.isAuthenticated, new FindAllTypesController_1.FindAllTypesController().handle);
router.get("/notifications/admin/types/:id", isAuthenticated_1.isAuthenticated, new FindNotificationTypeController_1.FindNotificationTypeController().handle);
router.get("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new DetailNotificationController_1.DetailNotificationController().handle);
router.put("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new UpdateNotificationController_1.UpdateNotificationController().handle);
router.put("/notifications/:notificationId/read", isAuthenticated_1.isAuthenticated, new ReadNotificationController_1.ReadNotificationController().handle);
router.put("/notifications/admin/types/:id", isAuthenticated_1.isAuthenticated, new UpdateNotificationTypeController_1.UpdateNotificationTypeController().handle);
router.post("/notifications", isAuthenticated_1.isAuthenticated, new CreateNotificationController_1.CreateNotificationController().handle);
router.post("/notifications/admin/types", isAuthenticated_1.isAuthenticated, new CreateNotificationTypeController_1.CreateNotificationTypeController().handle);
router.delete("/notifications/:notificationId", isAuthenticated_1.isAuthenticated, new DeleteNotificationController_1.DeleteNotificationController().handle);
// ROTAS ACTS
router.get("/acts/admin", isAuthenticated_1.isAuthenticated, new FindAllActChatbotsController_1.FindAllActChatbotsController().handle);
router.get("/acts/admin/by-trail", isAuthenticated_1.isAuthenticated, new FindByTrailController_1.FindByTrailController().handle);
router.get("/acts/admin/:id", isAuthenticated_1.isAuthenticated, new FindActChatbotController_1.FindActChatbotController().handle);
router.put("/acts/admin/update-many", isAuthenticated_1.isAuthenticated, new UpdateManyActChatbotsController_1.UpdateManyActChatbotsController().handle);
router.put("/acts/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateActChatbotController_1.UpdateActChatbotController().handle);
router.post("/acts/admin", isAuthenticated_1.isAuthenticated, new CreateActChatbotController_1.CreateActChatbotController().handle);
router.get("/acts", isAuthenticated_1.isAuthenticated, new GetActsDataController_1.GetActsDataController().handle);
router.get("/acts/chapters", isAuthenticated_1.isAuthenticated, new GetActChapterController_1.GetActChapterController().handle);
router.put("/acts/next", isAuthenticated_1.isAuthenticated, new MoveToNextActController_1.MoveToNextActController().handle);
router.post("/acts/message", isAuthenticated_1.isAuthenticated, new MessageActChatbotController_1.MessageActChatbotController().handle);
router.post("/acts/new-chapter", isAuthenticated_1.isAuthenticated, new CreateActChapterController_1.CreateActChapterController().handle);
router.post("/acts/chapters/compile", isAuthenticated_1.isAuthenticated, new CompileActChapterController_1.CompileActChapterController().handle);
router.put("/acts/chapters/:actChapterId", isAuthenticated_1.isAuthenticated, new UpdateActChapterController_1.UpdateActChapterController().handle);
router.get("/acts/full-story", isAuthenticated_1.isAuthenticated, new GetFullStoryController_1.GetFullStoryController().handle);
router.post("/trails/admin", isAuthenticated_1.isAuthenticated, new CreateTrailController_copy_1.CreateTrailController().handle);
router.get("/trails/admin", isAuthenticated_1.isAuthenticated, new FindAllTrailsController_1.FindAllTrailsController().handle);
router.get("/trails/admin/:id", isAuthenticated_1.isAuthenticated, new FindTrailController_1.FindTrailController().handle);
router.put("/trails/admin/:id", isAuthenticated_1.isAuthenticated, new UpdateTrailController_1.UpdateTrailController().handle);
// ROTAS INTEGRATIONS
router.get("/integrations/assessments/results", isAuthenticated_1.isAuthenticated, new ListResultsController_2.IntegrationListResultsController().handle);
router.get("/integrations/assessments/results/:id", isAuthenticated_1.isAuthenticated, new DetailResultController_2.IntegrationDetailResultController().handle);
router.post("/integrations/assessments/results", isAuthenticated_1.isAuthenticated, new CreateResultController_2.IntegrationCreateResultController().handle);
router.get("/integrations/assessments", isAuthenticated_1.isAuthenticated, new ListAssessmentsController_2.IntegrationListAssessmentsController().handle);
router.get("/integrations/assessments/:id", isAuthenticated_1.isAuthenticated, new DetailAssessmentController_2.IntegrationDetailAssessmentController().handle);
router.post("/integrations/assessments/feedback/users/:id", isAuthenticated_1.isAuthenticated, new GenerateUserFeedbackController_2.IntegrationGenerateUserFeedbackController().handle);
router.post("/integrations/assessments/feedback/companies/:id", isAuthenticated_1.isAuthenticated, new GenerateCompanyFeedbackController_2.IntegrationGenerateCompanyFeedbackController().handle);
router.get("/integrations/acts", isAuthenticated_1.isAuthenticated, new GetActsDataController_2.IntegrationGetActsDataController().handle);
router.get("/integrations/acts/chapters", isAuthenticated_1.isAuthenticated, new GetActChapterController_2.IntegrationGetActChapterController().handle);
router.put("/integrations/acts/next", isAuthenticated_1.isAuthenticated, new MoveToNextActController_2.IntegrationMoveToNextActController().handle);
router.post("/integrations/acts/message", isAuthenticated_1.isAuthenticated, new MessageActChatbotController_2.IntegrationMessageActChatbotController().handle);
router.post("/integrations/acts/new-chapter", isAuthenticated_1.isAuthenticated, new CreateActChapterController_2.IntegrationCreateActChapterController().handle);
router.post("/integrations/acts/chapters/compile", isAuthenticated_1.isAuthenticated, new CompileActChapterController_2.IntegrationCompileActChapterController().handle);
router.put("/integrations/acts/chapters/:actChapterId", isAuthenticated_1.isAuthenticated, new UpdateActChapterController_2.IntegrationUpdateActChapterController().handle);
router.get("/integrations/acts/full-story", isAuthenticated_1.isAuthenticated, new GetFullStoryController_2.IntegrationGetFullStoryController().handle);
router.post("/leads", async (req, res) => {
    var _a;
    const { name, email, phone, company, message, plan } = req.body;
    // Validação dos campos obrigatórios
    if (!name || !email) {
        return res.status(400).json({ error: "Name, email and plan are required." });
    }
    const leadInfo = "Este e-mail foi gerado a partir da captura de leads do site Zumira.\n" +
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Telefone: ${phone || "Não informado"}\n` +
        `Empresa: ${company || "Não informado"}\n` +
        `Plano: ${plan || "Nenhum"}\n` +
        `Mensagem: ${message || "Não informado"}`;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {
        await transporter.sendMail({
            from: {
                name: "Zumira",
                address: process.env.EMAIL_USER,
            },
            to: (_a = process.env.LEAD_CAPTURE_EMAIL) !== null && _a !== void 0 ? _a : "zumirajobs@gmail.com",
            subject: "Captura de leads zumira",
            text: leadInfo,
        });
        console.log("sent email");
        res.status(200).json({ success: true });
    }
    catch {
        console.log("failed to send email");
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});
