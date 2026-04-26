import { Router } from "express";

import { ListAlertsController } from "../controllers/alert/ListAlertsController";
import { ReadAlertController } from "../controllers/alert/ReadAlertController";
import { CreateAssessmentController } from "../controllers/assessment/CreateAssessmentController";
import { CreateQuestionController } from "../controllers/assessment/CreateQuestionController";
import { CreateResultController } from "../controllers/assessment/CreateResultController";
import { DetailAssessmentController } from "../controllers/assessment/DetailAssessmentController";
import { DetailResultController } from "../controllers/assessment/DetailResultController";
import { GenerateCompanyFeedbackController } from "../controllers/assessment/GenerateCompanyFeedbackController";
import { GenerateUserFeedbackController } from "../controllers/assessment/GenerateUserFeedbackController";
import { ListAssessmentsController } from "../controllers/assessment/ListAssessmentsController";
import { ListResultsController } from "../controllers/assessment/ListResultsController";
import { UpdateQuestionsController } from "../controllers/assessment/UpdateQuestionsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const assessmentsRoutes = Router();

assessmentsRoutes.get("/results", isAuthenticated, new ListResultsController().handle);
assessmentsRoutes.get("/results/:id", isAuthenticated, new DetailResultController().handle);
assessmentsRoutes.post("/results", isAuthenticated, new CreateResultController().handle);

assessmentsRoutes.post("/questions", isAuthenticated, new CreateQuestionController().handle);
assessmentsRoutes.put("/questions/:id", isAuthenticated, new UpdateQuestionsController().handle);

assessmentsRoutes.get("/alerts", isAuthenticated, new ListAlertsController().handle);
assessmentsRoutes.put("/alerts/:id/read", isAuthenticated, new ReadAlertController().handle);

assessmentsRoutes.get("/", isAuthenticated, new ListAssessmentsController().handle);
assessmentsRoutes.get("/:id", isAuthenticated, new DetailAssessmentController().handle);
assessmentsRoutes.post("/", isAuthenticated, new CreateAssessmentController().handle);
assessmentsRoutes.post("/feedback/users/:id", isAuthenticated, new GenerateUserFeedbackController().handle);
assessmentsRoutes.post("/feedback/companies/:id", isAuthenticated, new GenerateCompanyFeedbackController().handle);

export { assessmentsRoutes };
