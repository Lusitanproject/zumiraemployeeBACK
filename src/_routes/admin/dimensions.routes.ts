import { Router } from "express";

import { CreateDimensionController } from "../../controllers/admin/dimensions/CreateDimensionController";
import { EditDimensionController } from "../../controllers/admin/dimensions/EditDimensionController";
import { FindAllDimensionsController } from "../../controllers/admin/dimensions/FindAllDimensionController";
import { FindDimensionController } from "../../controllers/admin/dimensions/FindDimensionController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminDimensionsRoutes = Router();

adminDimensionsRoutes.post("/", isAuthenticated, new CreateDimensionController().handle);
adminDimensionsRoutes.get("/", isAuthenticated, new FindAllDimensionsController().handle);
adminDimensionsRoutes.get("/:psychologicalDimensionId", isAuthenticated, new FindDimensionController().handle);
adminDimensionsRoutes.put("/:psychologicalDimensionId", isAuthenticated, new EditDimensionController().handle);

export { adminDimensionsRoutes };
