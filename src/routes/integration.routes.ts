import { Router } from "express";

import { IntegrationCompileActChapterController } from "../controllers/integration/act/CompileActChapterController";
import { IntegrationCreateActChapterController } from "../controllers/integration/act/CreateActChapterController";
import { IntegrationGetActChapterController } from "../controllers/integration/act/GetActChapterController";
import { IntegrationGetActsDataController } from "../controllers/integration/act/GetActsDataController";
import { IntegrationGetFullStoryController } from "../controllers/integration/act/GetFullStoryController";
import { IntegrationMessageActChatbotController } from "../controllers/integration/act/MessageActChatbotController";
import { IntegrationMoveToNextActController } from "../controllers/integration/act/MoveToNextActController";
import { IntegrationUpdateActChapterController } from "../controllers/integration/act/UpdateActChapterController";
import { IntegrationCreateResultController } from "../controllers/integration/assessment/CreateResultController";
import { IntegrationDetailAssessmentController } from "../controllers/integration/assessment/DetailAssessmentController";
import { IntegrationDetailResultController } from "../controllers/integration/assessment/DetailResultController";
import { IntegrationGenerateCompanyFeedbackController } from "../controllers/integration/assessment/GenerateCompanyFeedbackController";
import { IntegrationGenerateUserFeedbackController } from "../controllers/integration/assessment/GenerateUserFeedbackController";
import { IntegrationListAssessmentsController } from "../controllers/integration/assessment/ListAssessmentsController";
import { IntegrationListResultsController } from "../controllers/integration/assessment/ListResultsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const integrationRouter = Router();

integrationRouter.get("/assessments/results", isAuthenticated, new IntegrationListResultsController().handle);
integrationRouter.get("/assessments/results/:id", isAuthenticated, new IntegrationDetailResultController().handle);
integrationRouter.post("/assessments/results", isAuthenticated, new IntegrationCreateResultController().handle);
integrationRouter.get("/assessments", isAuthenticated, new IntegrationListAssessmentsController().handle);
integrationRouter.get("/assessments/:id", isAuthenticated, new IntegrationDetailAssessmentController().handle);
integrationRouter.post(
  "/assessments/feedback/users/:id",
  isAuthenticated,
  new IntegrationGenerateUserFeedbackController().handle,
);
integrationRouter.post(
  "/assessments/feedback/companies/:id",
  isAuthenticated,
  new IntegrationGenerateCompanyFeedbackController().handle,
);

integrationRouter.get("/acts", isAuthenticated, new IntegrationGetActsDataController().handle);
integrationRouter.get("/acts/chapters", isAuthenticated, new IntegrationGetActChapterController().handle);
integrationRouter.get("/acts/full-story", isAuthenticated, new IntegrationGetFullStoryController().handle);
integrationRouter.put("/acts/next", isAuthenticated, new IntegrationMoveToNextActController().handle);
integrationRouter.post("/acts/message", isAuthenticated, new IntegrationMessageActChatbotController().handle);
integrationRouter.post("/acts/new-chapter", isAuthenticated, new IntegrationCreateActChapterController().handle);
integrationRouter.post(
  "/acts/chapters/compile",
  isAuthenticated,
  new IntegrationCompileActChapterController().handle,
);
integrationRouter.put(
  "/acts/chapters/:actChapterId",
  isAuthenticated,
  new IntegrationUpdateActChapterController().handle,
);

export { integrationRouter };
