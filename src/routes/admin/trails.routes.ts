import { Router } from "express";

import { CreateTrailController } from "../../controllers/admin/trails/CreateTrailController copy";
import { FindAllTrailsController } from "../../controllers/admin/trails/FindAllTrailsController";
import { FindTrailController } from "../../controllers/admin/trails/FindTrailController";
import { UpdateTrailController } from "../../controllers/admin/trails/UpdateTrailController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminTrailsRoutes = Router();

adminTrailsRoutes.post("/admin", isAuthenticated, new CreateTrailController().handle);
adminTrailsRoutes.get("/admin", isAuthenticated, new FindAllTrailsController().handle);
adminTrailsRoutes.get("/admin/:id", isAuthenticated, new FindTrailController().handle);
adminTrailsRoutes.put("/admin/:id", isAuthenticated, new UpdateTrailController().handle);

export { adminTrailsRoutes };
