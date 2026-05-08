import { Router } from "express";

import { AssessmentDetailForAdminController } from "../../controllers/assessment/AssessmentDetailForAdminController";
import { DuplicateAssessmentController } from "../../controllers/admin/assessments/DuplicateAssessmentController";
import { FindAllAssessmentsController } from "../../controllers/admin/assessments/FindAllAssessmentsController";
import { FindQuestionByAssessmentController } from "../../controllers/admin/assessments/FindQuestionByAssessmentController";
import { FindResultRatingsByAssessmentController } from "../../controllers/admin/assessments/FindResultRatingsByAssessmentController";
import { FindResultsFilteredController } from "../../controllers/admin/assessments/FindResultsFilteredController";
import { GenerateExcelReportController } from "../../controllers/admin/assessments/GenerateExcelReportController";
import { UpdateAssessmentController } from "../../controllers/admin/assessments/UpdateAssessmentController";
import { UpdateResultRatingsController } from "../../controllers/admin/assessments/UpdateResultRatingsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminAssessmentRouter = Router();

adminAssessmentRouter.get("/results", isAuthenticated, new FindResultsFilteredController().handle);
adminAssessmentRouter.get("/results/download-report", isAuthenticated, new GenerateExcelReportController().handle);
adminAssessmentRouter.get("/questions/:assessmentId", isAuthenticated, new FindQuestionByAssessmentController().handle);
adminAssessmentRouter.get("/ratings/:id", isAuthenticated, new FindResultRatingsByAssessmentController().handle);
adminAssessmentRouter.put("/ratings/:id", isAuthenticated, new UpdateResultRatingsController().handle);
adminAssessmentRouter.get("/", isAuthenticated, new FindAllAssessmentsController().handle);
adminAssessmentRouter.post("/duplicate/:id", isAuthenticated, new DuplicateAssessmentController().handle);
adminAssessmentRouter.get("/:id", isAuthenticated, new AssessmentDetailForAdminController().handle);
adminAssessmentRouter.put("/:id", isAuthenticated, new UpdateAssessmentController().handle);

export { adminAssessmentRouter };
