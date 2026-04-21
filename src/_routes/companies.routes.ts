import { Router } from "express";

import { FindAllCompaniesController } from "../controllers/admin/companies/FindAllCompaniesController";
import { FindAllFeedbacksController } from "../controllers/admin/companies/FindAllFeedbacksController";
import { FindCompanyController } from "../controllers/admin/companies/FindCompanyController";
import { SetCompanyAssessmentsController } from "../controllers/admin/companies/SetCompanyAssessmentsController";
import { FindCompanyFeedbackController } from "../controllers/company/FindCompanyFeedbackController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const companiesRoutes = Router();

companiesRoutes.get("/", isAuthenticated, new FindAllCompaniesController().handle);
companiesRoutes.get("/feedback", isAuthenticated, new FindAllFeedbacksController().handle);
companiesRoutes.get("/:companyId", isAuthenticated, new FindCompanyController().handle);
companiesRoutes.get("/:id/feedback", isAuthenticated, new FindCompanyFeedbackController().handle);
companiesRoutes.post("/:id/assessments", isAuthenticated, new SetCompanyAssessmentsController().handle);

export { companiesRoutes };
