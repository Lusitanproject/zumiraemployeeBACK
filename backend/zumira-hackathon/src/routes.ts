import { Request, Response, Router } from "express";
import nodemailer from "nodemailer";

import { CompileActChapterController } from "./controllers/act/CompileActChapterController";
import { CreateActChapterController } from "./controllers/act/CreateActChapterController";
import { GetActChapterController } from "./controllers/act/GetActChapterController";
import { GetActsDataController } from "./controllers/act/GetActsDataController";
import { GetFullStoryController } from "./controllers/act/GetFullStoryController";
import { MessageActChatbotController } from "./controllers/act/MessageActChatbotController";
import { MoveToNextActController } from "./controllers/act/MoveToNextActController";
import { UpdateActChapterController } from "./controllers/act/UpdateActChapterController";
import { CreateActChatbotController } from "./controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "./controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "./controllers/admin/acts/FindAllActChatbotsController";
import { FindByTrailController } from "./controllers/admin/acts/FindByTrailController";
import { UpdateActChatbotController } from "./controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "./controllers/admin/acts/UpdateManyActChatbotsController";
import { DuplicateAssessmentController } from "./controllers/admin/assessments/DuplicateAssessmentController";
import { FindAllAssessmentsController } from "./controllers/admin/assessments/FindAllAssessmentsController";
import { FindQuestionByAssessmentController } from "./controllers/admin/assessments/FindQuestionByAssessmentController";
import { FindResultRatingsByAssessmentController } from "./controllers/admin/assessments/FindResultRatingsByAssessmentController";
import { FindResultsFilteredController } from "./controllers/admin/assessments/FindResultsFilteredController";
import { GenerateExcelReportController } from "./controllers/admin/assessments/GenerateExcelReportController";
import { UpdateAssessmentController } from "./controllers/admin/assessments/UpdateAssessmentController";
import { UpdateResultRatingsController } from "./controllers/admin/assessments/UpdateResultRatingsController";
import { CreateCompanyController } from "./controllers/admin/companies/CreateCompanyController";
import { FindAllCompaniesController } from "./controllers/admin/companies/FindAllCompaniesController";
import { FindAllFeedbacksController } from "./controllers/admin/companies/FindAllFeedbacksController";
import { FindCompanyController } from "./controllers/admin/companies/FindCompanyController";
import { SetCompanyAssessmentsController } from "./controllers/admin/companies/SetCompanyAssessmentsController";
import { UpdateCompanyController } from "./controllers/admin/companies/UpdateCompanyController";
import { CreateDimensionController } from "./controllers/admin/dimensions/CreateDimensionController";
import { EditDimensionController } from "./controllers/admin/dimensions/EditDimensionController";
import { FindAllDimensionsController } from "./controllers/admin/dimensions/FindAllDimensionController";
import { FindDimensionByBlockController } from "./controllers/admin/dimensions/FindBySelfMonitoringController";
import { FindDimensionController } from "./controllers/admin/dimensions/FindDimensionController";
import { CreateNationalityController } from "./controllers/admin/nationalities/CreateNationalityController";
import { FindAllNationalitiesController } from "./controllers/admin/nationalities/FindAllNationalitiesController";
import { FindNationalityController } from "./controllers/admin/nationalities/FindNationalityController";
import { UpdateNationalityController } from "./controllers/admin/nationalities/UpdateNationalityController";
import { CreateNotificationController } from "./controllers/admin/notifications/CreateNotificationController";
import { CreateNotificationTypeController } from "./controllers/admin/notifications/CreateNotificationTypeController";
import { DeleteNotificationController } from "./controllers/admin/notifications/DeleteNotificationController";
import { FindAllNotificationsController } from "./controllers/admin/notifications/FindAllNotificationsController";
import { FindAllTypesController } from "./controllers/admin/notifications/FindAllTypesController";
import { FindNotificationTypeController } from "./controllers/admin/notifications/FindNotificationTypeController";
import { UpdateNotificationController } from "./controllers/admin/notifications/UpdateNotificationController";
import { UpdateNotificationTypeController } from "./controllers/admin/notifications/UpdateNotificationTypeController";
import { FindAllRolesController } from "./controllers/admin/roles/FindAllRolesController";
import { CreateSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { ListAllSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { FindSelfMonitoringBlocksController } from "./controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { CreateTrailController } from "./controllers/admin/trails/CreateTrailController copy";
import { FindAllTrailsController } from "./controllers/admin/trails/FindAllTrailsController";
import { FindTrailController } from "./controllers/admin/trails/FindTrailController";
import { UpdateTrailController } from "./controllers/admin/trails/UpdateTrailController";
import { CreateUserController as AdminCreateUserController } from "./controllers/admin/users/CreateUserController";
import { DeleteUserController } from "./controllers/admin/users/DeleteUserController";
import { FindUserController } from "./controllers/admin/users/FindUserController";
import { ListAllUsersController } from "./controllers/admin/users/ListAllUsersController";
import { ListUsersByCompanyController } from "./controllers/admin/users/ListUsersByCompanyController";
import { UpdateUserController } from "./controllers/admin/users/UpdateUserController";
import { ListAlertsController } from "./controllers/alert/ListAlertsController";
import { ReadAlertController } from "./controllers/alert/ReadAlertController";
import { AssessmentDetailForAdminController } from "./controllers/assessment/AssessmentDetailForAdminController";
import { CreateAssessmentController } from "./controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "./controllers/assessment/CreateQuestionController";
import { CreateResultController } from "./controllers/assessment/CreateResultController";
import { DetailAssessmentController } from "./controllers/assessment/DetailAssessmentController";
import { DetailResultController } from "./controllers/assessment/DetailResultController";
import { GenerateCompanyFeedbackController } from "./controllers/assessment/GenerateCompanyFeedbackController";
import { GenerateUserFeedbackController } from "./controllers/assessment/GenerateUserFeedbackController";
import { ListAssessmentsController } from "./controllers/assessment/ListAssessmentsController";
import { ListResultsController } from "./controllers/assessment/ListResultsController";
import { UpdateQuestionsController } from "./controllers/assessment/UpdateQuestionsController";
import { FindCompanyFeedbackController } from "./controllers/company/FindCompanyFeedbackController";
import { ListNationalitiesController } from "./controllers/nationality/ListNationalitiesController";
import { DetailNotificationController } from "./controllers/notification/DetailNotificationController";
import { ListNotificationsController } from "./controllers/notification/ListNotificationsController";
import { ReadNotificationController } from "./controllers/notification/ReadNotificationController";
import { ListSelfMonitoringBlockResultsController } from "./controllers/self-monitoring-block/ListSelfMonitoringBlockResultsController";
import { ListSelfMonitoringBlocksController } from "./controllers/self-monitoring-block/ListSelfMonitoringBlocksController";
import { AuthUserController } from "./controllers/user/auth/AuthUserController";
import { SendCodeController } from "./controllers/user/auth/SendCodeController";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

// ROTAS AUTH
router.post("/auth/email", new SendCodeController().handle);
router.post("/auth/verify", new AuthUserController().handle);

// ROTAS USERS
router.post("/users", new CreateUserController().handle);
router.post("/users/admin", isAuthenticated, new AdminCreateUserController().handle);
router.put("/users/admin/:id", isAuthenticated, new UpdateUserController().handle);
router.delete("/users/:id", isAuthenticated, new DeleteUserController().handle);
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

// ROTAS RESULTS
router.get("/assessments/results", isAuthenticated, new ListResultsController().handle);
router.get("/assessments/results/admin", isAuthenticated, new FindResultsFilteredController().handle);
router.get("/assessments/results/admin/download-report", isAuthenticated, new GenerateExcelReportController().handle);
router.get("/assessments/results/:id", isAuthenticated, new DetailResultController().handle);
router.post("/assessments/results", isAuthenticated, new CreateResultController().handle);

// ROTAS QUESTIONS
router.post("/assessments/questions", isAuthenticated, new CreateQuestionController().handle);
router.put("/assessments/questions/:id", isAuthenticated, new UpdateQuestionsController().handle);
router.get("/assessments/questions/:assessmentId", isAuthenticated, new FindQuestionByAssessmentController().handle);

// ROTAS RESULT RATINGS
router.get("/assessments/ratings/:id", isAuthenticated, new FindResultRatingsByAssessmentController().handle);
router.put("/assessments/ratings/:id", isAuthenticated, new UpdateResultRatingsController().handle);

// ROTAS ALERTS
router.get("/assessments/alerts", isAuthenticated, new ListAlertsController().handle);
router.put("/assessments/alerts/:id/read", isAuthenticated, new ReadAlertController().handle);

// ROTAS ASSESSMENT
router.get("/assessments", isAuthenticated, new ListAssessmentsController().handle);
router.get("/assessments/admin", isAuthenticated, new FindAllAssessmentsController().handle);
router.get("/assessments/:id", isAuthenticated, new DetailAssessmentController().handle);
router.get("/assessments/admin/:id", isAuthenticated, new AssessmentDetailForAdminController().handle);
router.post("/assessments", isAuthenticated, new CreateAssessmentController().handle);
router.post("/assessments/admin/duplicate/:id", isAuthenticated, new DuplicateAssessmentController().handle);
router.post("/assessments/feedback/users/:id", isAuthenticated, new GenerateUserFeedbackController().handle);
router.post("/assessments/feedback/companies/:id", isAuthenticated, new GenerateCompanyFeedbackController().handle);
router.put("/assessments/:id", isAuthenticated, new UpdateAssessmentController().handle);

// ROTAS SELF MONITORING
router.get("/self-monitoring", isAuthenticated, new ListSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin", isAuthenticated, new ListAllSelfMonitoringBlocksController().handle);
router.post("/self-monitoring/admin", isAuthenticated, new CreateSelfMonitoringBlocksController().handle);
router.put("/self-monitoring/admin/:id", isAuthenticated, new EditSelfMonitoringBlocksController().handle);
router.get("/self-monitoring/admin/:id", isAuthenticated, new FindSelfMonitoringBlocksController().handle);
router.get(
  "/self-monitoring/results/:selfMonitoringBlockId",
  isAuthenticated,
  new ListSelfMonitoringBlockResultsController().handle
);
router.get(
  "/self-monitoring/dimensions/:selfMonitoringBlockId",
  isAuthenticated,
  new FindDimensionByBlockController().handle
);

// ROTAS COMPANY
router.get("/companies", isAuthenticated, new FindAllCompaniesController().handle);
router.get("/companies/feedback", isAuthenticated, new FindAllFeedbacksController().handle);
router.get("/companies/:companyId", isAuthenticated, new FindCompanyController().handle);
router.get("/companies/:id/feedback", isAuthenticated, new FindCompanyFeedbackController().handle);
router.post("/companies/:id/assessments", isAuthenticated, new SetCompanyAssessmentsController().handle);
router.post("/companies/admin", isAuthenticated, new CreateCompanyController().handle);
router.put("/companies/admin/:id", isAuthenticated, new UpdateCompanyController().handle);

// ROTAS NATIONALITY
router.get("/nationalities", new ListNationalitiesController().handle);
router.post("/nationalities/admin", isAuthenticated, new CreateNationalityController().handle);
router.get("/nationalities/admin", isAuthenticated, new FindAllNationalitiesController().handle);
router.get("/nationalities/admin/:id", isAuthenticated, new FindNationalityController().handle);
router.put("/nationalities/admin/:id", isAuthenticated, new UpdateNationalityController().handle);

// ROTAS NOTIFICATION
router.get("/notifications", isAuthenticated, new ListNotificationsController().handle);
router.get("/notifications/admin", isAuthenticated, new FindAllNotificationsController().handle);
router.get("/notifications/admin/types", isAuthenticated, new FindAllTypesController().handle);
router.get("/notifications/admin/types/:id", isAuthenticated, new FindNotificationTypeController().handle);
router.get("/notifications/:notificationId", isAuthenticated, new DetailNotificationController().handle);
router.put("/notifications/:notificationId", isAuthenticated, new UpdateNotificationController().handle);
router.put("/notifications/:notificationId/read", isAuthenticated, new ReadNotificationController().handle);
router.put("/notifications/admin/types/:id", isAuthenticated, new UpdateNotificationTypeController().handle);
router.post("/notifications", isAuthenticated, new CreateNotificationController().handle);
router.post("/notifications/admin/types", isAuthenticated, new CreateNotificationTypeController().handle);
router.delete("/notifications/:notificationId", isAuthenticated, new DeleteNotificationController().handle);

// ROTAS ACTS
router.get("/acts/admin", isAuthenticated, new FindAllActChatbotsController().handle);
router.get("/acts/admin/by-trail", isAuthenticated, new FindByTrailController().handle);
router.get("/acts/admin/:id", isAuthenticated, new FindActChatbotController().handle);
router.put("/acts/admin/update-many", isAuthenticated, new UpdateManyActChatbotsController().handle);
router.put("/acts/admin/:id", isAuthenticated, new UpdateActChatbotController().handle);
router.post("/acts/admin", isAuthenticated, new CreateActChatbotController().handle);
router.get("/acts", isAuthenticated, new GetActsDataController().handle);
router.get("/acts/chapters", isAuthenticated, new GetActChapterController().handle);
router.put("/acts/next", isAuthenticated, new MoveToNextActController().handle);
router.post("/acts/message", isAuthenticated, new MessageActChatbotController().handle);
router.post("/acts/new-chapter", isAuthenticated, new CreateActChapterController().handle);
router.post("/acts/chapters/compile", isAuthenticated, new CompileActChapterController().handle);
router.put("/acts/chapters/:actChapterId", isAuthenticated, new UpdateActChapterController().handle);
router.get("/acts/full-story", isAuthenticated, new GetFullStoryController().handle);

router.post("/trails/admin", isAuthenticated, new CreateTrailController().handle);
router.get("/trails/admin", isAuthenticated, new FindAllTrailsController().handle);
router.get("/trails/admin/:id", isAuthenticated, new FindTrailController().handle);
router.put("/trails/admin/:id", isAuthenticated, new UpdateTrailController().handle);

router.post("/leads", async (req: Request, res: Response) => {
  const { name, email, phone, company, message, plan } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !email) {
    return res.status(400).json({ error: "Name, email and plan are required." });
  }

  const leadInfo =
    "Este e-mail foi gerado a partir da captura de leads do site Zumira.\n" +
    `Nome: ${name}\n` +
    `Email: ${email}\n` +
    `Telefone: ${phone || "Não informado"}\n` +
    `Empresa: ${company || "Não informado"}\n` +
    `Plano: ${plan || "Nenhum"}\n` +
    `Mensagem: ${message || "Não informado"}`;

  const transporter = nodemailer.createTransport({
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
        address: process.env.EMAIL_USER!,
      },
      to: process.env.LEAD_CAPTURE_EMAIL ?? "zumirajobs@gmail.com",
      subject: "Captura de leads zumira",
      text: leadInfo,
    });
    console.log("sent email");
    res.status(200).json({ success: true });
  } catch {
    console.log("failed to send email");
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

export { router };
