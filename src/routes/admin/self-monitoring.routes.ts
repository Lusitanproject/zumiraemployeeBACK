import { Router } from "express";

import { CreateSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { ListAllSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { FindSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { FindDimensionByBlockController } from "../../controllers/admin/dimensions/FindBySelfMonitoringController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminSelfMonitoringRoutes = Router();

adminSelfMonitoringRoutes.get("/admin", isAuthenticated, new ListAllSelfMonitoringBlocksController().handle);
adminSelfMonitoringRoutes.post("/admin", isAuthenticated, new CreateSelfMonitoringBlocksController().handle);
adminSelfMonitoringRoutes.put("/admin/:id", isAuthenticated, new EditSelfMonitoringBlocksController().handle);
adminSelfMonitoringRoutes.get("/admin/:id", isAuthenticated, new FindSelfMonitoringBlocksController().handle);
adminSelfMonitoringRoutes.get(
  "/dimensions/:selfMonitoringBlockId",
  isAuthenticated,
  new FindDimensionByBlockController().handle,
);

export { adminSelfMonitoringRoutes };
