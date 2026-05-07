import { Router } from "express";

import { CreateTrailController } from "../../controllers/admin/trails/CreateTrailController copy";
import { FindAllTrailsController } from "../../controllers/admin/trails/FindAllTrailsController";
import { FindTrailController } from "../../controllers/admin/trails/FindTrailController";
import { UpdateTrailController } from "../../controllers/admin/trails/UpdateTrailController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminTrailRouter = Router();

adminTrailRouter.post("/", isAuthenticated, new CreateTrailController().handle);
adminTrailRouter.get("/", isAuthenticated, new FindAllTrailsController().handle);
adminTrailRouter.get("/:id", isAuthenticated, new FindTrailController().handle);
adminTrailRouter.put("/:id", isAuthenticated, new UpdateTrailController().handle);

export { adminTrailRouter };
