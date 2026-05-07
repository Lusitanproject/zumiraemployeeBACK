import { Router } from "express";

import { CreateNationalityController } from "../../controllers/admin/nationalities/CreateNationalityController";
import { FindAllNationalitiesController } from "../../controllers/admin/nationalities/FindAllNationalitiesController";
import { FindNationalityController } from "../../controllers/admin/nationalities/FindNationalityController";
import { UpdateNationalityController } from "../../controllers/admin/nationalities/UpdateNationalityController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminNationalityRouter = Router();

adminNationalityRouter.post("/", isAuthenticated, new CreateNationalityController().handle);
adminNationalityRouter.get("/", isAuthenticated, new FindAllNationalitiesController().handle);
adminNationalityRouter.get("/:id", isAuthenticated, new FindNationalityController().handle);
adminNationalityRouter.put("/:id", isAuthenticated, new UpdateNationalityController().handle);

export { adminNationalityRouter };
