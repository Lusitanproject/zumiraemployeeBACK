import { Router } from "express";

import { CreateNationalityController } from "../../controllers/admin/nationalities/CreateNationalityController";
import { FindAllNationalitiesController } from "../../controllers/admin/nationalities/FindAllNationalitiesController";
import { FindNationalityController } from "../../controllers/admin/nationalities/FindNationalityController";
import { UpdateNationalityController } from "../../controllers/admin/nationalities/UpdateNationalityController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminNationalitiesRoutes = Router();

adminNationalitiesRoutes.post("/admin", isAuthenticated, new CreateNationalityController().handle);
adminNationalitiesRoutes.get("/admin", isAuthenticated, new FindAllNationalitiesController().handle);
adminNationalitiesRoutes.get("/admin/:id", isAuthenticated, new FindNationalityController().handle);
adminNationalitiesRoutes.put("/admin/:id", isAuthenticated, new UpdateNationalityController().handle);

export { adminNationalitiesRoutes };
