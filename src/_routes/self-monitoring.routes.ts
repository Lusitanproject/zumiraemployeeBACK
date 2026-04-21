import { Router } from "express";

import { ListSelfMonitoringBlockResultsController } from "../controllers/self-monitoring-block/ListSelfMonitoringBlockResultsController";
import { ListSelfMonitoringBlocksController } from "../controllers/self-monitoring-block/ListSelfMonitoringBlocksController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const selfMonitoringRoutes = Router();

selfMonitoringRoutes.get("/", isAuthenticated, new ListSelfMonitoringBlocksController().handle);
selfMonitoringRoutes.get(
  "/results/:selfMonitoringBlockId",
  isAuthenticated,
  new ListSelfMonitoringBlockResultsController().handle,
);

export { selfMonitoringRoutes };
