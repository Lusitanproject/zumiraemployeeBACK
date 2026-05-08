import { Router } from "express";

import { FindDimensionByBlockController } from "../../controllers/admin/dimensions/FindBySelfMonitoringController";
import { CreateSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/CreateSelfMonitoringBlockController";
import { EditSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/EditSelfMonitoringBlockController";
import { ListAllSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindAllSelfMonitoringBlocksController";
import { FindSelfMonitoringBlocksController } from "../../controllers/admin/self-monitoring/FindSelfMonitoringBlockController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminSelfMonitoringRouter = Router();

adminSelfMonitoringRouter.get("/", isAuthenticated, new ListAllSelfMonitoringBlocksController().handle);
adminSelfMonitoringRouter.post("/", isAuthenticated, new CreateSelfMonitoringBlocksController().handle);
adminSelfMonitoringRouter.put("/:id", isAuthenticated, new EditSelfMonitoringBlocksController().handle);
adminSelfMonitoringRouter.get("/dimensions/:selfMonitoringBlockId", isAuthenticated, new FindDimensionByBlockController().handle);
adminSelfMonitoringRouter.get("/:id", isAuthenticated, new FindSelfMonitoringBlocksController().handle);

export { adminSelfMonitoringRouter };
