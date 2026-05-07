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
import { ListCompanyAssessmentsController } from "../controllers/assessment/ListCompanyAssessmentsController";
import { ListResultsController } from "../controllers/assessment/ListResultsController";
import { UpdateQuestionsController } from "../controllers/assessment/UpdateQuestionsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const assessmentRouter = Router();

assessmentRouter.get("/results", isAuthenticated, new ListResultsController().handle);
assessmentRouter.get("/results/:id", isAuthenticated, new DetailResultController().handle);
assessmentRouter.post("/results", isAuthenticated, new CreateResultController().handle);

assessmentRouter.post("/questions", isAuthenticated, new CreateQuestionController().handle);
assessmentRouter.put("/questions/:id", isAuthenticated, new UpdateQuestionsController().handle);

assessmentRouter.get("/alerts", isAuthenticated, new ListAlertsController().handle);
assessmentRouter.put("/alerts/:id/read", isAuthenticated, new ReadAlertController().handle);

assessmentRouter.get("/", isAuthenticated, new ListAssessmentsController().handle);
assessmentRouter.get("/company", isAuthenticated, new ListCompanyAssessmentsController().handle);
assessmentRouter.get("/:id", isAuthenticated, new DetailAssessmentController().handle);
assessmentRouter.post("/", isAuthenticated, new CreateAssessmentController().handle);
assessmentRouter.post("/feedback/users/:id", isAuthenticated, new GenerateUserFeedbackController().handle);
assessmentRouter.post("/feedback/companies/:id", isAuthenticated, new GenerateCompanyFeedbackController().handle);

export { assessmentRouter };
