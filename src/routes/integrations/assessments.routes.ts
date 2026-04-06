import { Router } from "express";

import { IntegrationCreateResultController } from "../../controllers/integration/assessment/CreateResultController";
import { IntegrationDetailAssessmentController } from "../../controllers/integration/assessment/DetailAssessmentController";
import { IntegrationDetailResultController } from "../../controllers/integration/assessment/DetailResultController";
import { IntegrationGenerateCompanyFeedbackController } from "../../controllers/integration/assessment/GenerateCompanyFeedbackController";
import { IntegrationGenerateUserFeedbackController } from "../../controllers/integration/assessment/GenerateUserFeedbackController";
import { IntegrationListAssessmentsController } from "../../controllers/integration/assessment/ListAssessmentsController";
import { IntegrationListResultsController } from "../../controllers/integration/assessment/ListResultsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const integrationAssessmentsRoutes = Router();

integrationAssessmentsRoutes.get("/results", isAuthenticated, new IntegrationListResultsController().handle);
integrationAssessmentsRoutes.get("/results/:id", isAuthenticated, new IntegrationDetailResultController().handle);
integrationAssessmentsRoutes.post("/results", isAuthenticated, new IntegrationCreateResultController().handle);

integrationAssessmentsRoutes.get("/", isAuthenticated, new IntegrationListAssessmentsController().handle);
integrationAssessmentsRoutes.get("/:id", isAuthenticated, new IntegrationDetailAssessmentController().handle);
integrationAssessmentsRoutes.post(
  "/feedback/users/:id",
  isAuthenticated,
  new IntegrationGenerateUserFeedbackController().handle,
);
integrationAssessmentsRoutes.post(
  "/feedback/companies/:id",
  isAuthenticated,
  new IntegrationGenerateCompanyFeedbackController().handle,
);

export { integrationAssessmentsRoutes };
