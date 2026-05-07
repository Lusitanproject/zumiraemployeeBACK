import { Router } from "express";

import { CreateDimensionController } from "../../controllers/admin/dimensions/CreateDimensionController";
import { EditDimensionController } from "../../controllers/admin/dimensions/EditDimensionController";
import { FindAllDimensionsController } from "../../controllers/admin/dimensions/FindAllDimensionController";
import { FindDimensionController } from "../../controllers/admin/dimensions/FindDimensionController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminDimensionRouter = Router();

adminDimensionRouter.post("/", isAuthenticated, new CreateDimensionController().handle);
adminDimensionRouter.get("/", isAuthenticated, new FindAllDimensionsController().handle);
adminDimensionRouter.get("/:psychologicalDimensionId", isAuthenticated, new FindDimensionController().handle);
adminDimensionRouter.put("/:psychologicalDimensionId", isAuthenticated, new EditDimensionController().handle);

export { adminDimensionRouter };
