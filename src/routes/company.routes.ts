import { Router } from "express";

import { FindCompanyFeedbackController } from "../controllers/company/FindCompanyFeedbackController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const companyRouter = Router();

companyRouter.get("/:id/feedback", isAuthenticated, new FindCompanyFeedbackController().handle);

export { companyRouter };
