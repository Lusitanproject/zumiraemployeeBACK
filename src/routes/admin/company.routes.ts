import { Router } from "express";

import { CreateCompanyController } from "../../controllers/admin/companies/CreateCompanyController";
import { FindActAnalysisController } from "../../controllers/admin/companies/FindActAnalysisController";
import { FindActAnalysisFactorMessagesController } from "../../controllers/admin/companies/FindActAnalysisFactorMessagesController";
import { FindAllCompaniesController } from "../../controllers/admin/companies/FindAllCompaniesController";
import { FindAllFeedbacksController } from "../../controllers/admin/companies/FindAllFeedbacksController";
import { FindCompanyController } from "../../controllers/admin/companies/FindCompanyController";
import { GenerateActAnalysisController } from "../../controllers/admin/companies/GenerateActAnalysisController";
import { GenerateAnalysisReportController } from "../../controllers/admin/companies/GenerateAnalysisReportController";
import { GenerateAllUserFeedbackController } from "../../controllers/admin/companies/GenerateAllUserFeedbackController";
import { SetCompanyAssessmentsController } from "../../controllers/admin/companies/SetCompanyAssessmentsController";
import { UpdateCompanyController } from "../../controllers/admin/companies/UpdateCompanyController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminCompanyRouter = Router();

adminCompanyRouter.get("/", isAuthenticated, new FindAllCompaniesController().handle);
adminCompanyRouter.get("/feedback", isAuthenticated, new FindAllFeedbacksController().handle);
adminCompanyRouter.get("/:companyId", isAuthenticated, new FindCompanyController().handle);
adminCompanyRouter.post("/", isAuthenticated, new CreateCompanyController().handle);
adminCompanyRouter.put("/:id", isAuthenticated, new UpdateCompanyController().handle);
adminCompanyRouter.post("/:id/assessments", isAuthenticated, new SetCompanyAssessmentsController().handle);
adminCompanyRouter.post(
  "/:companyId/acts/:actChatbotId/analysis",
  isAuthenticated,
  new GenerateActAnalysisController().handle,
);
adminCompanyRouter.get(
  "/:companyId/acts/:actChatbotId/analysis/report",
  isAuthenticated,
  new GenerateAnalysisReportController().handle,
);
adminCompanyRouter.get(
  "/:companyId/acts/:actChatbotId/analysis",
  isAuthenticated,
  new FindActAnalysisController().handle,
);
adminCompanyRouter.get(
  "/:companyId/acts/:actChatbotId/analysis/factors/:factorId/messages",
  isAuthenticated,
  new FindActAnalysisFactorMessagesController().handle,
);
adminCompanyRouter.post(
  "/:companyId/feedback/users",
  isAuthenticated,
  new GenerateAllUserFeedbackController().handle,
);

export { adminCompanyRouter };
