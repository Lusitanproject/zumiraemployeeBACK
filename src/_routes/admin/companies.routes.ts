import { Router } from "express";

import { CreateCompanyController } from "../../controllers/admin/companies/CreateCompanyController";
import { UpdateCompanyController } from "../../controllers/admin/companies/UpdateCompanyController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminCompaniesRoutes = Router();

adminCompaniesRoutes.post("/admin", isAuthenticated, new CreateCompanyController().handle);
adminCompaniesRoutes.put("/admin/:id", isAuthenticated, new UpdateCompanyController().handle);

export { adminCompaniesRoutes };
