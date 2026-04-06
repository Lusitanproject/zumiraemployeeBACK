import { Router } from "express";

import { DuplicateAssessmentController } from "../../controllers/admin/assessments/DuplicateAssessmentController";
import { FindAllAssessmentsController } from "../../controllers/admin/assessments/FindAllAssessmentsController";
import { FindQuestionByAssessmentController } from "../../controllers/admin/assessments/FindQuestionByAssessmentController";
import { FindResultRatingsByAssessmentController } from "../../controllers/admin/assessments/FindResultRatingsByAssessmentController";
import { FindResultsFilteredController } from "../../controllers/admin/assessments/FindResultsFilteredController";
import { GenerateExcelReportController } from "../../controllers/admin/assessments/GenerateExcelReportController";
import { UpdateAssessmentController } from "../../controllers/admin/assessments/UpdateAssessmentController";
import { UpdateResultRatingsController } from "../../controllers/admin/assessments/UpdateResultRatingsController";
import { AssessmentDetailForAdminController } from "../../controllers/assessment/AssessmentDetailForAdminController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminAssessmentsRoutes = Router();

adminAssessmentsRoutes.get("/results/admin", isAuthenticated, new FindResultsFilteredController().handle);
adminAssessmentsRoutes.get(
  "/results/admin/download-report",
  isAuthenticated,
  new GenerateExcelReportController().handle,
);

adminAssessmentsRoutes.get(
  "/questions/:assessmentId",
  isAuthenticated,
  new FindQuestionByAssessmentController().handle,
);

adminAssessmentsRoutes.get("/ratings/:id", isAuthenticated, new FindResultRatingsByAssessmentController().handle);
adminAssessmentsRoutes.put("/ratings/:id", isAuthenticated, new UpdateResultRatingsController().handle);

adminAssessmentsRoutes.get("/admin", isAuthenticated, new FindAllAssessmentsController().handle);
adminAssessmentsRoutes.get("/admin/:id", isAuthenticated, new AssessmentDetailForAdminController().handle);
adminAssessmentsRoutes.post("/admin/duplicate/:id", isAuthenticated, new DuplicateAssessmentController().handle);
adminAssessmentsRoutes.put("/:id", isAuthenticated, new UpdateAssessmentController().handle);

export { adminAssessmentsRoutes };
